import React, { useState, useEffect } from 'react';
import { ReactSVG } from 'react-svg';
import Modal from "react-modal";
import { Rings } from 'react-loader-spinner'
import { useParams } from 'react-router-dom';
import { Provider, useWallet } from '@txnlab/use-wallet'

import algosdk from 'algosdk'






const Books = () => {
  const  docName  = useParams()
  let stringId = docName.id
  const [post, setPost] = useState({});
  const { signer, activeAddress, signTransactions, sendTransactions } = useWallet()
  const address = activeAddress
  const balance = 0
  const owner = ""
 
  const config = {
    algodToken: "",
    algodServer: "https://testnet-api.algonode.cloud/",
    algodPort: "",
    indexerToken: "",
    indexerServer: "https://testnet-api.algonode.cloud/",
    indexerPort: "",
};

const algodClient = new algosdk.Algodv2(config.algodToken, config.algodServer, config.algodPort);
const indexerClient = new algosdk.Indexer(config.indexerToken, "https://testnet-idx.4160.nodely.dev", 443);


  const [newComment, setNewComment] = useState('');
  const [userId, setUserId] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalIsOpen2, setModalIsOpen2] = useState(false);

    const [modalIsOpen3, setModalIsOpen3] = useState(false);
    const [modalIsOpen4, setModalIsOpen4] = useState(false);
    const categories = ['1', '20',"50", '100'];
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [donateamt, setdonateamt] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isapproved, setisapproved] = useState(false);
    const [isassetid, setisassetid] = useState(0);
    const [nftbalance, setnftbalance] = useState(0);
    const [rating, setRating] = useState(0);
    const [quantity, setQuantity] = useState(1);

   


    useEffect(() => {
      


      const Getnfts = async () => {
        try {
          const response = await fetch('https://us-central1-almond-1b205.cloudfunctions.net/tronstorydapp/nftid2222', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ Nftid: docName.id }), // Move body here
          });
        
          const result = await response.json();
        
          if (response.ok) {
            setPost(result.nftdata);
            let appaccount = algosdk.getApplicationAddress(728381637)
            const accountInfo = await algodClient.accountInformation(appaccount).do();
            const asset = accountInfo.assets.find((a) => Number(a.assetId) === result.nftdata.assetid);
           
                if (asset) {
                  setnftbalance(Number(asset.amount))
                  setisassetid(result.nftdata.assetid)
                  
                } else {
                  setnftbalance(0)
                }
           
            //setisdoc()
          }
        } catch (error) {
          console.log('Error: ' + error.message);
        } finally {
          setLoading(false);
        }
        
      }
  
      Getnfts()

    },[])








      async function addComment() {
        try {
          const response = await fetch('https://us-central1-almond-1b205.cloudfunctions.net/tronstorydapp/Comment2222', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ Nftid: docName.id , comment: newComment,userId : address, rating : rating }),
          });
      
          if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
          }
      
          const results = await response.json();
          console.log('Fetched Documents:', results);
          if (results.message === 'Comment added successfully'){
            setModalIsOpen(true)
    setModalIsOpen3(false)
    setModalIsOpen4(false)
    setModalIsOpen2(true)
            setLoading(false)
           // handleUpload2()
          }
        //  // return results;
        } catch (error) {
          console.error('Error fetching documents:', error);
          return null;
        }
      }


      async function addDownload() {
        try {
          const response = await fetch('https://us-central1-almond-1b205.cloudfunctions.net/tronstorydapp/download2222', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ Nftid: docName.id , userId : address,  }),
          });
      
          if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
          }
      
          const results = await response.json();
        //  console.log('Fetched Documents:', results);
          setLoading(false)
          setModalIsOpen(true)
          setModalIsOpen3(false)
          setModalIsOpen4(true)
          setModalIsOpen2(false)
        //  // return results;
        } catch (error) {
          console.error('Error fetching documents:', error);
          return null;
        }
      }

  const handleAddComment = (e) => {
    e.preventDefault();
    if (newComment.trim() && userId.trim()) {
      const updatedComments = [...post.comments, { comment: newComment, userId }];
      setPost({ ...post, comments: updatedComments });
      setNewComment(''); // Clear the input after adding
      setUserId('');     // Clear the user input
    }
  };

  const handleStarClick = (index) => {
    setRating(index + 1); // Update rating based on the clicked star index
  };

  const handleUpload = async (tokenId,amount) => {

   
if ( parseInt(quantity) > nftbalance  ){
alert("Please ensure the quantity amount entered is not above the total supply")
return;
}else{
  setLoading(true);
 
   try {

    const authorizeMethod = new algosdk.ABIMethod( {
      "name": "purchase_book",
      "args": [
          {
              "type": "asset",
              "name": "nft",
              "desc": "The NFT being purchased."
          },
          {
              "type": "pay",
              "name": "payment",
              "desc": "The payment to the creator."
          }
      ],
      "readonly": false,
      "returns": {
          "type": "void"
      },
      "desc": "Allows a user to purchase an NFT."
  });

  const params = await algodClient.getTransactionParams().do();
  params.fee = 2_000
  params.flat_fee = true
  const atc = new algosdk.AtomicTransactionComposer()
  const assetInfo = await algodClient.getAssetByID(isassetid).do();
  let appaccount = algosdk.getApplicationAddress(728381637)
  let to = assetInfo.params.creator
  const byteArray = algosdk.encodeUint64(isassetid)

  const transactiontocreator = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    sender: activeAddress,
    receiver: to,
    amount: amount * 1000000,
    suggestedParams :params,
  })
  const transactiontoncontract = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    sender: activeAddress,
    receiver: appaccount,
    amount: amount* 1000000,
    suggestedParams: params,
  })

  const txn0 = algosdk.makeApplicationNoOpTxnFromObject({
    sender: activeAddress,
    appIndex:728381637, //728365432,
    suggestedParams: { ...params, fee: 3000 },
    appArgs: [authorizeMethod.getSelector(), algosdk.encodeUint64(0),new Uint8Array(Buffer.from([transactiontoncontract]))],
    foreignAssets:[isassetid],
    boxes:[{appIndex : 728381637,name: byteArray}],

});


const txn1 = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
  sender: activeAddress,
  receiver: activeAddress, // Opting in by sending 0 asset amount to self
  assetIndex: isassetid,
  amount: 0,
  suggestedParams: params
});

      atc.addTransaction({ txn: txn1, signer: signer })
      atc.addTransaction({ txn: transactiontocreator, signer: signer })
      atc.addTransaction({ txn: txn0, signer: signer })
            
      const result2 = await atc.execute(algodClient, 4)
      console.log(result2)
     
     // console.log(assetInfo.params.creator)
     await addDownload()

    
      
      console.log('Product uploaded successfully!')
   } catch (error) {
       console.error('Error uploading product:', error);
       setLoading(false)
       alert("An error occured")
     
   } finally {
     
   }
}

};


let totalRatings
let averageRating



if (Array.isArray(post.comment) && post.comment.length > 0) {
  totalRatings = post.comment.reduce((total, review) => total + review.rating, 0);
  averageRating = totalRatings / post.comment.length;
} else {
  // Handle case where post.comment is undefined or length is 0
  totalRatings = 0;
  averageRating = 0;
}
const handleIncrement = () => {
  setQuantity(prevQuantity => prevQuantity + 1);
};

// Function to handle quantity decrement
const handleDecrement = () => {
  if (quantity > 1) {
    setQuantity(prevQuantity => prevQuantity - 1);
  }
};
  
  return (
    <div style={{ background: '#140C1F' }}>
  
  {loading? <div className="flex flex-col items-center justify-center min-h-screen bg-darkBlue text-white">
  <Rings
            visible={true}
            height="130"
            width="130"
            color="#F81DFB"
            ariaLabel="rings-loading"
          />
  {!address ?  <p className="text-md md:text-lg mb-4 mt-10" style={{fontSize: 15}}>Please ensure your wallet is connected.....</p> : <p className="text-md md:text-lg mb-4 mt-10" style={{fontSize: 15}}></p>}
        
    </div> :
  
  <div className="p-4 md:p-8 lg:p-16 max-w-screen-lg mx-auto" >
     
    
     {/* <div className="flex justify-center mb-4">
  <div className="rounded-lg overflow-hidden shadow-lg border border-gray-300">
    <img
      src={post.image}
      alt={post.title}
      className="object-contain w-full h-100"
    />
  </div>
</div> */}
<div className="flex justify-center mb-10">
  <div className="rounded-lg overflow-hidden shadow-lg border border-gray-300 w-full max-w-md h-64"> {/* Set fixed height here */}
    <img
      src={post.image}
      alt={post.title}
      className="object-cover w-full h-full" 
    />
  </div>
</div>


<div className="text-center mb-20">
       <h1 className="text-xl md:text-3xl font-bold mb-4" style={{ background: "linear-gradient(to right, #FFFFFF, #F81DFB)",
          WebkitBackgroundClip: "text",
          color: "transparent", }} >{post.title}</h1>
     </div>




     <div className="flex flex-row justify-between">
      <div className='flex flex-row gap-5'>

      <div className="overflow-hidden shadow-lg border border-gray-300 w-14 h-14 rounded-full">
  <img
    src={post.image}
    // src={`data:image/jpeg;base64,${post.image}`}
    alt={post.title}
    className="object-cover w-full h-full"
  />
</div>
       <p className="text-lg md:text-xl mb-4" style={{fontSize: 16}}><strong>Author</strong> <p className="text-lg md:text-xl mb-4" style={{fontSize: 13}}>{post.author}</p></p>
       <div
            
             // onClick={() => {setSelectedCategory(category); setdonateamt(category)}}
              className={`flex items-center justify-center w-32 h-10 m-2 bg-orange-500 text-white rounded-full shadow-md hover:bg-orange-600 focus:outline-none ring-pink-500`}
              style={{background:  "transparent", color: "#F81DFB", fontSize: 13, borderColor:  "#F81DFB", borderWidth: 1}}
            >
          Supply : {nftbalance}
            </div>
      </div>
      <div className='flex flex-col'>
      <p className="text-lg md:text-xl mb-4" style={{ fontSize: 20, fontFamily: "Oxanium" }}>
  <strong>
    {post && post.amount !== undefined
      ? `${post.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ALGO`
      : "Amount not available"}
  </strong>
</p>

      {/* <div className="flex justify-center mt-4">
        <button   className="flex items-center justify-center">
            <ReactSVG
              src="/assets/buy.svg"
              beforeInjection={(svg) => {
                svg.setAttribute("style", "width: 120px; height: auto;");
              }}
            />
         
          </button>
        </div> */}
               {/* <div className="flex items-center justify-center mb-4">
  <button
    className="bg-gray-300 text-white font-bold py-1 px-2 rounded-l"
    onClick={handleDecrement}
    style={{background: "#F81DFB"}}
  >
    -
  </button>
  <input
    type="text"
    value={quantity}
    onChange={(e) => setQuantity(e.target.value)}  
    className="text-center w-12 border-t border-b border-gray-300 focus:outline-none"
    style={{ background: 'rgba(255, 255, 255, 0.1)' }}
  />
  <button
    className="bg-gray-300 text-white font-bold py-1 px-2 rounded-r"
    onClick={handleIncrement}
    style={{background: "#F81DFB"}}
  >
    +
  </button>
</div> */}


       <button
 
  // style="background-color: #4CAF50; color: white;"

onClick={() => { 
  const mainamount = parseFloat(post.amount) * parseInt(quantity)
 
  handleUpload(docName.id,mainamount)
}}
  className="flex items-center justify-center p-2.5 text-white bg-violet-800 rounded-lg"
  style={{ background: "#F81DFB", height: 40, borderRadius: 50, fontFamily: "Oxanium", fontSize:14 }}
>
<strong>BUY</strong>
</button>


      </div>

    
     </div>

     <div className="text-left">
       <p className="text-lg md:text-xl mb-4" style={{fontSize: 15}}>{post.description}</p>
     </div>

     <div className="text-left">
      <div className='flex flex-row justify-between'> 
      <h2 className="text-2xl font-semibold mb-2" style={{fontFamily: "Oxanium",fontSize: 20}}>Reviews</h2>
       <div className="flex items-center gap-2">
          <h1 style={{fontFamily: "Oxanium", fontSize:22}}  className="text-2xl font-semibold text-end text-white">
            {averageRating}.0
          </h1>

                      <img
                          //key={i}
                          src={"/assets/star.svg"}
                          alt="star"
                          width={25}
                          height={25}
                        />
          
        </div>
      </div>

     </div>
     <div className="flex flex-col gap-6 overflow-y-auto max-h-80" style={{width: "100%", alignSelf: "center",}}>
     {post && Array.isArray(post.comment) && post.comment.length === 0 ? (
  <p className="text-gray-400">No comments yet. Be the first to comment!</p>
) : (
  post && Array.isArray(post.comment) && post.comment.map((comment, commentIndex) => (
    <div
      key={commentIndex}  // Consider using comment.id if available
      className="flex flex-col gap-2 p-4 rounded-lg mb-5"
      style={{
        background: "linear-gradient(to right, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1))",
      }}
    >
      <p className="text-lg font-semibold text-white" style={{ fontSize: 14, marginLeft: 8 }}>
        {comment.comment}
      </p>
      <div className="flex items-center">
        <ReactSVG
          src="/assets/person.svg"
          beforeInjection={(svg) => {
            svg.setAttribute('style', 'width: 30px; height: auto;');
          }}
        />
        <h2 className="text-sm text-gray-400" style={{ fontSize: 14, marginLeft: 8 }}>
          {comment.userId}
        </h2>
      </div>
    </div>
  ))
)}


       {/* {post.comment.map((comment, commentIndex) => (
       
       <div key={commentIndex} className="flex flex-col gap-2 bg-gray-800 p-4 rounded-lg mb-5" style={{ background:
        "linear-gradient(to right, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1))",}} >
       <p className="text-lg font-semibold text-white" style={{fontSize:14, marginLeft: 8}}>{comment.comment}</p>
       <div className="flex items-center ">
       <ReactSVG src="/assets/person.svg" beforeInjection={(svg) => {
        svg.setAttribute('style', 'width: 30px; height: auto;');
      }} />
       <h2 className="text-sm text-gray-400" style={{fontSize:14, marginLeft: 8}}>{comment.userId}</h2>
       </div>
       
     </div>
        ))} */}
</div>


{/* <div className="mt-14 flex" style={{ alignItems: "center", justifyContent: "center" }}>
  <div
    className="flex items-center bg-gray-50 p-4 rounded-full shadow-sm mb-0"
    style={{
      width: "100%",
      height: 60,
      background: "linear-gradient(to bottom, rgba(9, 23, 41, 0.5), #091729)",
      position: "relative",  // Ensure the button is positioned properly
    }}
  >
    <div className="relative flex-grow">
      <textarea
        type="text"
        placeholder="Add Comment..."
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        className="w-full px-4 py-2 bg-white rounded-full text-gray-500 focus:outline-none focus:ring-2 focus:ring-black-300"
        style={{
          height: 40,
          fontSize: 13,
          background: "linear-gradient(to right,rgba(10, 54, 65, 1),rgba(12, 11, 21, 0.95))",
          marginTop: 5,
          color: "white",
        }}
      />
    </div>
    <button
      onClick={() => {
        setLoading(true);
        addComment();
      }}
      className="ml-4 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300"
      style={{
        background: "linear-gradient(to right, #1A61ED, #11BAE3)",
        height: 30,
        alignItems: "center",
        fontSize: 12,
        width: 70,
        position: "relative",
        zIndex: 1,  // Ensure button is above other elements
      }}
    >
      Send
    </button>
  </div>
</div> */}
{/* <button 
  onClick={() => setModalIsOpen(true)}  
  className="fixed bottom-20 right-5 px-10 py-2 text-lg font-semibold text-white bg-orange-500 rounded-full shadow-lg hover:bg-blue-500 focus:outline-none" 
  style={{ fontSize: 14, background: "linear-gradient(to right, #1A61ED, #11BAE3)", zIndex: 2 }}>
  Donate
</button> */}

<>
  
     
     <section style={{marginTop: -130}} className="flex flex-col justify-center items-center px-5 py-8  bg-darkBlue text-white rounded-lg max-md:max-w-full md:px-20 min-h-screen" >
     <div className="flex items-center gap-1" style={{marginTop : -400, marginBottom: 30}}>
     {Array.from({ length: 5 }, (_, i) => (
       <img
         key={i}
         onClick={() => handleStarClick(i)} // Handle click event
         src={i < rating ? "/assets/star.svg" : "/assets/star2.svg"} // Colored star if index is less than rating
         alt="star"
         width={30}
         height={30}
         className="cursor-pointer" // Change cursor to pointer on hover
       />
     ))}
   </div>
     <div className="flex items-center justify-center ">
 <header className="flex gap-2 flex-wrap md:flex-nowrap w-full max-w-2xl bg-darkBlue text-white">
  
   <div className="flex flex-col items-center justify-center mb-5 " style={{marginTop: -15, fontFamily: "Oxanium", }}>
     <h2 className="text-xl leading-normal font-semibold text-slate-800 text-white">
       Tap to drop a rating
     </h2>
    
   </div>
 </header>
</div>

<button
onClick={() => {
  if (rating > 0){
    setModalIsOpen(true)
    setModalIsOpen3(true)
    setModalIsOpen4(false)
    setModalIsOpen2(false)
  }
}}
  type="submit"
  className="flex items-center justify-center p-2.5 text-white bg-violet-800 rounded-lg"
  style={{ background:  "#F81DFB", height: 40, borderRadius: 50, width : "40%", fontFamily: "Oxanium", fontSize:15, opacity: rating > 0?  1 : 0.2 }}
>
<strong>Write review</strong>
</button>


     </section>
           </>




          <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        className="relative bg-darkBlue text-white p-6 rounded-lg w-full max-w-lg mx-auto text-center min-h-96"
        overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center"
        style={{background: "linear-gradient(to right,rgba(10, 54, 65, 1),rgba(12, 11, 21, 1))",  }}
      >
        {modalIsOpen2 &&
        <>

<div className="flex-col justify-center items-center">
  <div className="flex flex-col justify-center items-center mb-5">
  <ReactSVG src="/assets/tick.svg" beforeInjection={(svg) => {
        svg.setAttribute('style', 'width: 150px; height: auto;');
      }} />
   
  </div>
  <h2 className="text-xl font-semibold mb-4">Success</h2>
  <div className="flex-1 flex justify-center">You have successfully reviewed this product</div>
  
</div>
        </> }

       {modalIsOpen3 && <>
        <h2 className="text-xl font-semibold mb-3" style={{fontFamily: "Oxanium",}}>Drop a Review</h2>
        {/* <p style={{ marginTop: 0,fontSize:14, marginBottom:20}}>Funds donated will be split between Author and Healthcare specialist</p> */}
        {/* <div className="flex items-center bg-gray-50 p-4 rounded-full shadow-sm mb-0" style={{ width: "100%", height: 60, background: "linear-gradient(to bottom, rgba(9, 23, 41, 0.5), #091729)",  }}> */}
        
        {/* <div className="relative flex-grow">
       
          <input
            type="text"
            placeholder="Amount"
            value={donateamt}
        
            onChange={(e) => setdonateamt(e.target.value)} // update temporary state
            className="w-full px-4 py-2 bg-white rounded-full text-gray-500 focus:outline-none focus:ring-2 focus:ring-black-300"
            style={{ height: 40, fontSize: 13, background: "linear-gradient(to right,rgba(10, 54, 65, 1),rgba(12, 11, 21, 0.95))", marginTop: 5, textAlign: "center", color: "white"}}
          />

        </div> */}
        {/* <div className="flex justify-center mb-10 mt-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {setSelectedCategory(category); setdonateamt(category)}}
              className={`flex items-center justify-center w-20 h-10 m-2 bg-orange-500 text-white rounded-full shadow-md hover:bg-orange-600 focus:outline-none ${
                selectedCategory === category ? 'ring-1 ring-blue-500' : ''
              }`}
              style={{backgroundColor: "rgba(17, 186, 227, 0.3)", color: "rgba(17, 186, 227, 1)", fontSize: 13}}
            >
              ${category} ALGO
            </button>
          ))}
        </div> */}
            <div className="relative flex-grow mb-10">
      <textarea
        type="text"
        placeholder="Add Comment..."
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        className="w-full px-4 py-2 bg-white text-gray-500 focus:outline-none focus:ring-2 focus:ring-black-300"
        style={{
          height: 130,
          fontSize: 13,
          background:"linear-gradient(to right, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1))",
          marginTop: 5,
          color: "white",
          borderRadius:15
        }}
      />
    </div>
        <button
         onClick={() => {
            setLoading(true)
            addComment()}} // trigger the search on button click
          className="ml-4 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300"
          style={{ background: "#F81DFB", height: 40, alignItems: "center", fontSize: 15,fontFamily: "Oxanium", width: 130 }}
        >
          Send
        </button>
       

        </>
        }

{modalIsOpen4 &&
        <>

<div className="flex-col justify-center items-center">
  <div className="flex flex-col justify-center items-center mb-5">
  <ReactSVG src="/assets/tick.svg" beforeInjection={(svg) => {
        svg.setAttribute('style', 'width: 150px; height: auto;');
      }} />
   
  </div>
  <h2 className="text-xl font-semibold mb-4">Success</h2>
  <div className="flex-1 flex justify-center">You have successfully purchased this NFT/Book Enjoy!!</div>
  
</div>
        </> }


      </Modal>
   </div>}
  
    </div>
  
  );
};

export default Books;
