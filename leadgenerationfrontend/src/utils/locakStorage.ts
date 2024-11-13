import CryptoJS from 'crypto-js';

const encryptState = (state: any) => {
  try {
    const serializedState = JSON.stringify(state);
    return CryptoJS.AES.encrypt(
      serializedState,
      process.env.SECRET_KEY ||
        "k;!q'`)I@5'V7E6UMiziF_*y?Jq(Z8c#C1+^oUe_Gnhj4K=1sZWNlW0d;4>AsWB"
    ).toString();
  } catch (err) {
    console.error('Could not encrypt state', err);
    return null;
  }
};

// Function to decrypt the state
const decryptState = (encryptedState: string) => {
  try {
    const bytes = CryptoJS.AES.decrypt(
      encryptedState,
      process.env.SECRET_KEY ||
        "k;!q'`)I@5'V7E6UMiziF_*y?Jq(Z8c#C1+^oUe_Gnhj4K=1sZWNlW0d;4>AsWB"
    );
    const decryptedState = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedState);
  } catch (err) {
    console.error('Could not decrypt state', err);
    return undefined;
  }
};

export const saveState = (state: any) => {
  try {
    const encryptedState = encryptState(state);
    if (encryptedState) {
      localStorage.setItem('reduxState', encryptedState);
    }
  } catch (err) {
    console.error('Could not save state', err);
  }
};

export const loadState = () => {
  try {
    const encryptedState = localStorage.getItem('reduxState');
    if (encryptedState === null) {
      return undefined; // If no state is found, return undefined for reducer initialization
    }
    return decryptState(encryptedState);
  } catch (err) {
    console.error('Could not load state', err);
    return undefined;
  }
};
