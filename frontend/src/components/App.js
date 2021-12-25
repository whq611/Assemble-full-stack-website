import {
  BrowserRouter as Router,
  Switch,
  useHistory,
  Route,
  Link,
  Redirect,
} from "react-router-dom";

import * as React from "react";


import { logout } from "../context/authSlice.js";
import { useDispatch } from "react-redux";

import { useSelector } from "react-redux";
import Home from "./home/Home.js";
import LeaderBoard from "./leaderboard/LeaderBoard.js";
import Login from "./auth/Login.js";
import Profile from "./profile/Profile.js";
import Event from "./event/Event.js";
import SignUp from "./auth/SignUp.js";
import CreateEvent from "./createEvent/CreateEvent.js";
import { selectUserInfo } from "../context/authSlice.js";
import { selectAuthState } from "../context/store.js";
import "./App.css";
import "antd/dist/antd.css";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";

import LogoPic from "../assets/Assemble.png";

import { userLogout } from "../services/api.js";

function UserProfileOrLogin(optUserInfo) {
  if (optUserInfo) {
    const { id } = optUserInfo;
    return (
      <MenuItem component={Link} to={`/profile/${id}`}>
        <Typography textAlign="center">Profile</Typography>
      </MenuItem>
    );
  } else {
    return (
      <MenuItem component={Link} to="/login">
        <Typography textAlign="center">Log In</Typography>
      </MenuItem>
    );
  }
}

function NavBar() {
  const userInfo = selectUserInfo(useSelector(selectAuthState));

  const pages = ["Products", "Pricing", "Blog"];
  const dispatch = useDispatch();
  const history = useHistory();

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const onLogout = () => {
    userLogout();
    dispatch(logout());
    history.push("/");
  };

  return (
    <AppBar position="static" style={{ background: "Black", marginBottom: 24 }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            ></IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Box
            component="img"
            sx={{
              height: 60,
            }}
            alt="Your logo."
            src={LogoPic}
          />
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            <Button
              sx={{ my: 2, color: "white", display: "block" }}
              component={Link}
              to="/"
            >
              Home
            </Button>
            <Button
              sx={{ my: 2, color: "white", display: "block" }}
              component={Link}
              to="/leaderboard"
            >
              Leaderboard
            </Button>
            {userInfo && (
              <Button
                sx={{ my: 2, color: "white", display: "block" }}
                component={Link}
                to="/create-event"
              >
                Create Event
              </Button>
            )}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar />
            </IconButton>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {/* {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))} */}
              {UserProfileOrLogin(userInfo)}
              {!userInfo && (
                <MenuItem component={Link} to="/signup">
                  <Typography textAlign="center">Sign Up</Typography>
                </MenuItem>
              )}
              {userInfo && (
                <MenuItem onClick={onLogout}>
                  <Typography textAlign="center">Log Out</Typography>
                </MenuItem>
              )}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

// This allows us to implement redirect via `useHistory`.
function InRouterApp() {
  // TODO for now this is fine, but might need to switch to reducer at some point
  const userInfo = selectUserInfo(useSelector(selectAuthState));

  return (
    <div>
      <NavBar />

      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/leaderboard" component={LeaderBoard} />
        <Route path="/login">
          {" "}
          <Login />{" "}
        </Route>
        <Route path="/profile/:id">
          {" "}
          <Profile />{" "}
        </Route>
        <Route path="/create-event">
          {userInfo ? <CreateEvent /> : <Redirect to="/" />}
        </Route>
        <Route path="/event/:id" component={Event} />
        <Route path="/signup" component={SignUp} />
        <Route path="*">
          {" "}
          <Redirect to="/" />{" "}
        </Route>
      </Switch>
    </div>
  );
}

function App() {
  return (
    <Router>
      <InRouterApp />
    </Router>
  );
}

export default App;
