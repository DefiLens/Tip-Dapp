const UNIVERSAL_RESOLVER = `
query MyQuery($address: Identity!) {
  Wallet(input: {identity: $address, blockchain: ethereum}) {
    identity
    addresses
    primaryDomain {
      name
      isPrimary
    }
    domains(input: {limit: 50}) {
      name
      isPrimary
    }
    socials {
      dappName
      profileName
      profileCreatedAtBlockTimestamp
      userAssociatedAddresses
    }
  }
}
`;

const UNIVERSAL_RESOLVER3 = `
  query MyQuery($searchInput: String!) {
    Socials(input: {filter: {dappName: {_eq: farcaster}, profileName: { _regex: $searchInput }} blockchain: ethereum}) {
      Social {
        dappName
        profileName
        profileBio
        profileDisplayName
        profileImage
        profileUrl
        userAddress
      }
    }
  }
`;

const UNIVERSAL_RESOLVER2 = `
query MyQuery($address: Identity!) {
  Wallet(input: {identity: $address, blockchain: ethereum}) {
    socials {
      dappName
      profileName
    }
    domains {
      name
    }
    primaryDomain {
      name
    }
    addresses
    xmtp {
      isXMTPEnabled
    }
  }
}
`;

export default UNIVERSAL_RESOLVER;

// query GetFarcasterUsersWithEthereumAddress {
//   Wallet(
//     input: {identity: "0xb50685c25485ca8c520f5286bbbf1d3f216d6989", blockchain: ethereum}
//   ) {
//     socials {
//       dappName
//       profileName
//     }
//     domains {
//       name
//     }
//     primaryDomain {
//       name
//     }
//     addresses
//     xmtp {
//       isXMTPEnabled
//     }
//   }
// }


// built a quesry which grab data for params and it can be farcaster id, connected ddress, ens or lens etc

// query GetSocialData {
//   Socials(
//     input: {filter: {identity: {_eq: "vitalik.eth"}}, blockchain: ethereum, limit: 50}
//   ) {
//     Social {
//       dappName
//       profileName
//       profileBio
//       profileDisplayName
//       profileImage
//       profileUrl
//       userAddress
//       connectedAddresses {
//         address
//         blockchain
//       }
//     }
//   }
// }

// query GetFarcasterDetailsByUsername {
//   Socials(input: {filter: {profileName: {_eq: "degenfi"}}, blockchain: ethereum}) {
//     Social {
//       dappName
//       profileName
//       profileBio
//       profileDisplayName
//       profileImage
//       profileUrl
//       userAddress
//       userCreatedAtBlockTimestamp
//       userCreatedAtBlockNumber
//       userRecoveryAddress
//       connectedAddresses {
//         address
//         blockchain
//       }
//     }
//   }
// }


// query SearchFarcasterUsers {
//   Socials(
//     input: {
//       filter: {
//         profileName: { _regex: "degenfi" }
//       }
//       blockchain: ethereum
//     }
//   ) {
//     Social {
//       dappName
//       profileName
//       profileBio
//       profileDisplayName
//       profileImage
//       profileUrl
//       userAddress
//     }
//   }
// }