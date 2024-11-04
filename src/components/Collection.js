import React, { useState, useEffect } from 'react';
import { ReactSVG } from 'react-svg';
import { useNavigate } from "react-router-dom";
import { Link,NavLink } from "react-router-dom";
import { Rings } from 'react-loader-spinner'

import { Provider, useWallet } from '@txnlab/use-wallet'

const Collection = () => {


    const navigate = useNavigate()
    const [nfts, setnfts] = useState([]);
    const [nfts2, setnfts2] = useState([]);
    const [rate, setrate] = useState(0);
    const [loading, setLoading] = useState(true); 
    const [isdownloaded, setisdownloaded] = useState(false); 
    const { signer, activeAddress, signTransactions, sendTransactions } = useWallet()
  const address = activeAddress
    const balance = 0

    console.log(activeAddress)
  useEffect(() => {
    const Getnfts = async () => {
      try {
        const response = await fetch('https://us-central1-almond-1b205.cloudfunctions.net/tronstorydapp/nftcollection22222', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({userId : `${activeAddress}` }),
        });

        const result = await response.json();
    
        if (response.ok) {
          const nftCollection = result.nftdata.NFTcollection;

        const downloadedNFTs = nftCollection?.filter(nft => nft.downloaded === true);
        const notDownloadedNFTs = nftCollection?.filter(nft => !nft.downloaded);

         setnfts(notDownloadedNFTs);
         setnfts2(downloadedNFTs)

        }
      } catch (error) {
        console.log('Error: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    const Getnfts2 = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=algorand&vs_currencies=usd');
        const result = await response.json();
    
        setrate(result.algorand.usd);  // Accessing Algorand's price in USD
      } catch (error) {
        console.log('Error: ' + error.message);
      }
    };
    

    Getnfts();
    Getnfts2();
  }, []);  // The empty array makes it run only once when the component mounts




  
  const NFTCard = ({ image, title, author, price, id }) => {
   
    const balanceInUsd = price * rate;
    
  return(
    
    <div
    onClick={() => {
      navigate(`/nftbook2/${id}`)
    }}
      className="bg-gray-900 bg-opacity-70 backdrop-blur-md rounded-lg p-4 shadow-md"
      style={{
        background:
          "linear-gradient(to right, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1))",
      }}
    >
      <img src={image} alt={title} className="rounded-lg w-full mb-4" />
      <div className="text-white">
        <h3 className="font-bold text-xl mb-2">{title}</h3>
        <p className="text-gray-400">By {author}</p>
        <div className="flex justify-between items-center mt-4">
          <p className="text-sm">
            On Sale <span role="img" aria-label="fire">🔥</span>
          </p>
          {/* Align this div to the far right */}
          <div className="flex flex-col justify-end ml-auto">
            <p className="font-bold">{price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ALGO</p>
            <p className="text-sm text-gray-400">${balanceInUsd.toFixed(2)}</p>
          </div>
        </div>
        {/* Centering the button */}
        {/* <div className="flex justify-center mt-4">
        <Link  to={`/nftbook/${id}`} className="flex items-center justify-center">
            <ReactSVG
              src="/assets/bid.svg"
              beforeInjection={(svg) => {
                svg.setAttribute("style", "width: 220px; height: auto;");
              }}
            />
         
          </Link>
        </div> */}
      </div>
    </div>
  )}

  const NFTCard2 = ({ image, title, author, price, id }) => {
   
    const balanceInUsd = price * rate;
    
  return(
    
    <div
    onClick={() => {
      navigate(`/nftbook2/${id}`)
    }}
      className="bg-gray-900 bg-opacity-70 backdrop-blur-md rounded-lg p-4 shadow-md"
      style={{
        background:
          "linear-gradient(to right, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1))",
      }}
    >
      <img src={image} alt={title} className="rounded-lg w-full mb-4" />
      <div className="text-white">
        <h3 className="font-bold text-xl mb-2">{title}</h3>
        <p className="text-gray-400">By {author}</p>
        <div className="flex justify-between items-center mt-4">
          <p className="text-sm">
            Purchsed  <span role="img" aria-label="fire">✅</span>
          </p>
          {/* Align this div to the far right */}
          <div className="flex flex-col justify-end ml-auto">
            <p className="font-bold">{price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ALGO</p>
            <p className="text-sm text-gray-400">${balanceInUsd.toFixed(2)}</p>
          </div>
        </div>
        {/* Centering the button */}
        {/* <div className="flex justify-center mt-4">
        <Link  to={`/nftbook/${id}`} className="flex items-center justify-center">
            <ReactSVG
              src="/assets/bid.svg"
              beforeInjection={(svg) => {
                svg.setAttribute("style", "width: 220px; height: auto;");
              }}
            />
         
          </Link>
        </div> */}
      </div>
    </div>
  )}
  
  

  return (
    <div className="  py-10" style={{background: '#140C1F'}}>
         {loading? <div className="flex flex-col items-center justify-center min-h-screen bg-darkBlue text-white">
    <Rings
            visible={true}
            height="130"
            width="130"
            color="#F81DFB"
            ariaLabel="rings-loading"
          />
    </div> :
       
       <>
       <div className="text-center " style={{marginBottom: 80}}>
        {/* <p className="text-gray-400 text-sm">Most Loved NFTs Of The Time</p> */}
        <h1 className="text-white text-3xl sm:text-3xl lg:text-5xl font-bold" 
     style={{
       background: "linear-gradient(to right, #FFFFFF, #F81DFB)",
       WebkitBackgroundClip: "text",
       color: "transparent"
     }}>
My Collection
</h1>

      </div>
      <div className="flex items-center justify-center">
  <div
    className="flex items-center justify-between space-x-6 w-full"
    style={{
      background: 'rgba(255, 255, 255, 0.1)',
      height: 60,
      width: "90%",
      alignSelf: "center",
    borderRadius: 10
    }}
  >
    <button
      className="flex-1 flex items-center justify-center text-white bg-violet-800 rounded-lg"
      style={{
        background: "#F81DFB",
        height: 45,
        borderRadius: 10,
        fontFamily: "Oxanium",
        fontSize: 14,
      }}
      onClick={() => {
        setisdownloaded(false)
      }}
    >
      <strong>Uploaded </strong>
    </button>

    <button
      className="flex-1 flex items-center justify-center text-white bg-violet-800 rounded-lg"
      style={{
        background: "#F81DFB",
        height: 45,
        borderRadius: 10,
        fontFamily: "Oxanium",
        fontSize: 14,
      }}
      onClick={() => {
        setisdownloaded(true)
      }}
    >
      <strong>Downloaded </strong>
    </button>
  </div>
</div>

{isdownloaded ? (
  <>
    {(!nfts2 || nfts2.length === 0) ? (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-400 text-lg" style={{marginTop: -400, fontSize: 24}}>No NFTs Yet!</p>
      </div>
    ) : (
      <div className="container mx-auto pt-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {nfts2.map((nft, index) => (
            <div onClick={() => { }} key={index} className="w-full max-w-xs mx-auto">
              <NFTCard2
                image={nft.image}
                title={nft.title}
                author={nft.author}
                price={nft.amount}
                id={nft.Nftid}
              />
            </div>
          ))}
        </div>
      </div>
    )}
  </>
) : (
  <>
    {(!nfts || nfts.length === 0) ? (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-400 text-lg" style={{marginTop: -400, fontSize: 24}}>No NFTs Yet!</p>
      </div>
    ) : (
      <div className="container mx-auto pt-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {nfts.map((nft, index) => (
            <div onClick={() => { }} key={index} className="w-full max-w-xs mx-auto">
              <NFTCard
                image={nft.image}
                title={nft.title}
                author={nft.author}
                price={nft.amount}
                id={nft.Nftid}
              />
            </div>
          ))}
        </div>
      </div>
    )}
  </>
)}




</>
}

    </div>
  );
};

export default Collection;
