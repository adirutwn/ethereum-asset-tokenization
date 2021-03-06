pragma solidity ^0.4.23;

import "../node_modules/zeppelin-solidity/contracts/token/ERC721/ERC721Token.sol";

contract RealEstate is ERC721Token {

  address constant GOVERNMENT = 0xe779B1cD36d1C211CC4C0BCb6bBd5110e6Aaf9E0;
  mapping(uint256 => bool) internal blacklistedRealEstate;

  constructor (string _name, string _symbol) public ERC721Token(_name, _symbol) {

  }

  modifier onlyGovernment() {
    require(msg.sender == GOVERNMENT);
    _;
  }

  function tokenizedRealEstate(
    address _realEstateOwner,
    uint256 _tokenId
  ) onlyGovernment public {
    super._mint(_realEstateOwner, _tokenId);
  }

  function disableTransfer(
    uint256 _tokenId
  ) onlyGovernment public {
    blacklistedRealEstate[_tokenId] = true;
  }

  function enableTransfer(
    uint256 _tokenId
  ) onlyGovernment public {
    blacklistedRealEstate[_tokenId] = false;
  }

  function transferFrom(
    address _from,
    address _to,
    uint256 _tokenId
  ) public {
    require(blacklistedRealEstate[_tokenId] == false);
    super.transferFrom(_from, _to, _tokenId);
  }

  function safeTransferFrom(
    address _from,
    address _to,
    uint256 _tokenId
  ) public {
    require(blacklistedRealEstate[_tokenId] == false);
    super.safeTransferFrom(_from, _to, _tokenId);
  }

  function safeTransferFrom(
    address _from,
    address _to,
    uint256 _tokenId,
    bytes _data
  ) public {
    require(blacklistedRealEstate[_tokenId] == false);
    super.safeTransferFrom(_from, _to, _tokenId, _data);
  }
}
