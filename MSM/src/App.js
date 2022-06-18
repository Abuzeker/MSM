import { BrowserRouter, Switch, Route } from "react-router-dom"
import Login from "./pages/Login/Login";
import PageLayout from "./pages/PageLayout/PageLayout";

function App() {
  return (
    <div>
        <BrowserRouter>
          <Switch>
            {/* <Route path='/Testpage2' component={Testpage2}></Route> */}
            <Route path='/Login' component={Login}></Route>
            <Route path='/' component={PageLayout}></Route>
          </Switch>
        </BrowserRouter>
    </div>
  );
}

export default App;
