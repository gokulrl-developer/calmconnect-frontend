import { BrowserRouter as Router } from "react-router-dom"
import AppRoutes from "./Routes"

function App(){
  console.log("app ")
   return (
  <Router>
    <AppRoutes/>
  </Router>
   )
}

export default App
