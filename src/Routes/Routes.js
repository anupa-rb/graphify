import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from "../Pages/Home";
import Prim from "../Pages/Prims";
import Kruskal from "../Pages/Kruskals";
import Dijktra from "../Pages/Dijktras";


const Router = () => {
  return (
    <BrowserRouter>
      <Switch></Switch>

      <Route path="/" component={Home} exact />
      <Route path="/prims" component={Prim} />
      <Route path="/kruskals" component={Kruskal} />
      <Route path="/dijkstras" component={Dijktra} />

    </BrowserRouter>
  );
};
export default Router;
