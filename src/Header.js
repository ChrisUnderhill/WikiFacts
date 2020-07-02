import React from "react"
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import {Link} from "react-router-dom";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles({
    root: {
        "margin-bottom": "20px",
    },
});


function Header(props) {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h4" className="title"><Link to={"/"}>
                        WikiFacts
                    </Link></Typography>
                    {props.username ?
                        <Link to={"/account"}><Button color="inherit">{props.username}</Button></Link>
                        :
                        <Link to={"/login"}><Button color="inherit">Login</Button></Link>
                    }
                </Toolbar>
            </AppBar>
        </div>)
}

export default Header;