pragma solidity ^0.5.16;
pragma experimental ABIEncoderV2;

import { ERC721Full } from "./openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol";
import { SafeMath } from "./openzeppelin-solidity/contracts/math/SafeMath.sol";


/**
 * @notice - This is the NFT contract for a photo
 */
contract PhotoNFT is ERC721Full {
    using SafeMath for uint256;

    uint256 public currentPhotoId;
    
    constructor(
        string memory _nftName, 
        string memory _nftSymbol
    ) 
        public 
        ERC721Full(_nftName, _nftSymbol) 
    {
    }

    /** 
     * @dev mint a photoNFT
     * @dev tokenURI - URL include ipfs hash
     */
    function mint(address to, string memory tokenURI) public returns (bool) {
        /// Mint a new PhotoNFT
        uint newPhotoId = getNextPhotoId();
        currentPhotoId++;
        _mint(to, newPhotoId);
        _setTokenURI(newPhotoId, tokenURI);
    }


    ///--------------------------------------
    /// Getter methods
    ///--------------------------------------


    ///--------------------------------------
    /// Private methods
    ///--------------------------------------
    function getNextPhotoId() private returns (uint nextPhotoId) {
        return currentPhotoId.add(1);
    }
    

}
