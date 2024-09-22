import {
  createMint,
  TOKEN_PROGRAM_ID,
  MINT_SIZE,
  createInitializeMint2Instruction,
  getMinimumBalanceForRentExemptMint,
} from "@solana/spl-token";
import {
  Transaction,
  SystemProgram,
  Keypair,
  sendAndConfirmTransaction,
} from "@solana/web3.js";

export function TokenLaunchpad() {
  async function createToken() {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed"); // Ensure connection is defined
    const lamports = await getMinimumBalanceForRentExemptMint(connection);

    const name = document.getElementById("name").value;
    const symbol = document.getElementById("symbol").value;
    const image = document.getElementById("image").value;
    const initialSupply = document.getElementById("initialSupply").value;

    const payer = Keypair.generate(); // Ensure payer is defined properly (or fetched from wallet)
    const mintAuthority = payer.publicKey;
    const freezeAuthority = payer.publicKey; // Optional freeze authority
    const decimals = 6; // You can modify the number of decimals as per requirement

    const keypair = Keypair.generate();
    const transaction = new Transaction().add(
      SystemProgram.createAccount({
        fromPubkey: payer.publicKey,
        newAccountPubkey: keypair.publicKey,
        space: MINT_SIZE,
        lamports,
        programId: TOKEN_PROGRAM_ID, // Make sure the program ID is correct
      }),

      createInitializeMint2Instruction(
        keypair.publicKey, // Corrected to use keypair's public key
        decimals, // Number of decimals for the token
        mintAuthority, // Mint authority
        freezeAuthority, // Freeze authority (can be null if not needed)
        TOKEN_PROGRAM_ID, // Program ID
      ),
    );

    transaction.partialSign(keypair); // Partial sign with mint account's keypair
    await wallet.signTransaction(transaction); // Assuming 'wallet' is the connected wallet object
    await sendAndConfirmTransaction(
      connection,
      transaction,
      [payer, keypair], // Sign with payer and keypair
      { commitment: "confirmed" }, // Optional confirmOptions
    );
  }

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <h1>Solana Token Launchpad</h1>
      <input
        id="name"
        className="inputText"
        type="text"
        placeholder="Name"
      ></input>{" "}
      <br />
      <input
        id="symbol"
        className="inputText"
        type="text"
        placeholder="Symbol"
      ></input>{" "}
      <br />
      <input
        id="image"
        className="inputText"
        type="text"
        placeholder="Image URL"
      ></input>{" "}
      <br />
      <input
        id="initialSupply"
        className="inputText"
        type="text"
        placeholder="Initial Supply"
      ></input>{" "}
      <br />
      <button onClick={createToken} className="btn">
        Create a token
      </button>
    </div>
  );
}

