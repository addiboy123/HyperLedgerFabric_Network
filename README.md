# 🔗 Blockchain Application with Hyperledger Fabric

## 🧱 Tech Stack Used

* **Blockchain Framework**: [Hyperledger Fabric](https://hyperledger-fabric.readthedocs.io/)
* **World State**: [CouchDB](https://docs.couchdb.org/)
* **Chaincode Language**: [Go](https://go.dev/doc/)
* **Backend**: [Express.js](https://expressjs.com/), [Hyperledger Fabric Node.js SDK](https://hyperledger.github.io/fabric-sdk-node/)
* **Frontend**: [React with TypeScript](https://www.typescriptlang.org/docs/handbook/react.html) (built using [AI Bolt.new](https://bolt.new))
* **Containerization**: [Docker](https://docs.docker.com/), [Docker Compose](https://docs.docker.com/compose/)

---

## 🚀 Features of the Application

* Three Organizations
* Two peers per organization (1 Anchor Peer + 1 Endorsing Peer)
* One Certificate Authority (CA) per Organization
* Three Ordering Nodes using **RAFT** consensus protocol
* RESTful API exposed via **Hyperledger Fabric Node.js SDK**
* Web-based Graphical User Interface (GUI)

---

## ⚙️ Pre-requisites

* Install **Hyperledger Fabric**
* Export path to the `fabric-samples/bin` directory

  ```bash
  export PATH=$PATH:/path/to/fabric-samples/bin
  ```

---

## ▶️ How to Run the Application

1. **Clone the repository**

   ```bash
   git clone https://github.com/addiboy123/HyperLedgerFabric_Network.git
   cd HyperLedgerFabric_Network
   ```

2. **Create channel artifacts**

   ```bash
   cd artifacts/channel
   ./create-artifacts.sh
   ```

   > ⚠️ **Note:** If you regenerate channel artifacts, make sure to delete `org1-wallet` and `org2-wallet` directories inside the `api-2.0` folder before restarting.

3. **Generate connection profiles (CCP)**

   ```bash
   cd ../../api-2.0/config
   ./generate-ccp.sh
   ```

4. **Uncomment** the `preset` function in `deployChaincode.sh` (only for the first-time setup)

   ```bash
   # File: deployChaincode.sh
   # Uncomment the line: preset
   ```

5. **Start the application**

   ```bash
   cd ../..
   ./start.sh
   ```

6. **Open the frontend in your browser**

   ```
   http://localhost:5173
   ```

7. **Access the World State (CouchDB):**

   * `peer0.org1`: [http://localhost:5984/\_utils/](http://localhost:5984/_utils/)
   * `peer1.org1`: [http://localhost:6984/\_utils/](http://localhost:6984/_utils/)
   * `peer0.org2`: [http://localhost:7984/\_utils/](http://localhost:7984/_utils/)
   * `peer1.org2`: [http://localhost:8984/\_utils/](http://localhost:8984/_utils/)

8. **Shut down the application**

   ```bash
   sudo docker compose -f ./artifacts/docker-compose.app.yml down
   sudo docker compose -f ./artifacts/docker-compose.fabric.yml down
   ```

9. **(Optional) Remove all Docker images (⚠️ use with caution)**

   ```bash
   docker system prune -a
   ```

---

## 📚 References

| Tool/Technology        | Documentation                                                   | Extra Resources                                                                   |
| ---------------------- | --------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| **Hyperledger Fabric** | [Docs](https://hyperledger-fabric.readthedocs.io/)              |                                                                                   |
| **Fabric Node.js SDK** | [Docs](https://hyperledger.github.io/fabric-sdk-node/)          |                                                                                   |
| **CouchDB**            | [Docs](https://docs.couchdb.org/)                               |                                                                                   |
| **Go**                 | [Docs](https://go.dev/doc/)                                     |                                                                                   |
| **Express.js**         | [Docs](https://expressjs.com/)                                  | [YouTube](https://www.youtube.com/results?search_query=expressjs+tutorial)        |
| **React (TypeScript)** | [Docs](https://www.typescriptlang.org/docs/handbook/react.html) | [YouTube](https://www.youtube.com/results?search_query=react+typescript+tutorial) |
| **Docker**             | [Docs](https://docs.docker.com/)                                | [YouTube](https://www.youtube.com/results?search_query=docker+tutorial)           |
| **Docker Compose**     | [Docs](https://docs.docker.com/compose/)                        | [YouTube](https://www.youtube.com/results?search_query=docker+compose+tutorial)   |

---

## ✅ Notes

* Ensure `docker`, `docker-compose`, and `fabric-samples` are correctly installed and accessible from your shell.
* Use executable permissions (`chmod +x`) if shell scripts fail to run.
* If you encounter permission issues with Docker, consider adding your user to the `docker` group or use `sudo`.

---
