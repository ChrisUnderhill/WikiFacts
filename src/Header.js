import React from "react"
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import {Link} from "react-router-dom";


function Header(props) {
    return (<AppBar position="static">
        <Toolbar>
            <Typography variant="h4" className="title"><Link to={"/"}>
                WikiFacts
            </Link></Typography>
            <Link to={"/login"}><Button color="inherit">Login</Button></Link>
        </Toolbar>
    </AppBar>)
}

export default Header;