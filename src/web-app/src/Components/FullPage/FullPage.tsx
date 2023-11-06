import React from "react";

import TopNavBar from "../TopNavBar/TopNavBar";
import { HashRouter as Router, Switch } from "react-router-dom";
import { GuardProvider, GuardedRoute } from "react-router-guards";

import LandingPage from "../../Pages/LandingPage/LandingPage";
import ProfilePage from "../../Pages/ProfilePage/ProfilePage";
import AchievementPage from "../../Pages/AchievementPage/AchievementPage";
import LoginPage from "../../Pages/LoginPage/LoginPage";
import RegisterPage from "../../Pages/RegisterPage/RegisterPage";
import CreateTournamentPage from "../../Pages/CreateTournamentPage/CreateTournamentPage";
import TeamFinderPage from "../../Pages/TeamFinderPage/TeamFinderPage";
import CreateLobbyPage from "../../Pages/CreateLobbyPage/CreateLobbyPage";
import LobbyPage from "../../Pages/LobbyPage/LobbyPage";
import TournamentPage from "../../Pages/TournamentPage/TournamentPage";
import AllTournamentsPage from "../../Pages/AllTournamentsPage/AllTournamentsPage";
import MessagePage from "../../Pages/MessagePage/MessagePage";
import ProfileSettingsPage from "../../Pages/ProfileSettingsPage/ProfileSettingsPage";
import TeamsPage from "../../Pages/TeamsPage/TeamsPage";
import FollowInfoPage from "../../Pages/FollowInfoPage/FollowInfoPage";
import CreateGamePage from "../../Pages/CreateGamePage/CreateGamePage";
import { getLoggedinUser } from "../../Services/FirebaseFunctions/auth";
import EditTournamentPage from "../../Pages/EditTournamentPage/EditTournamentPage";

function FullPage(Props: Object) {
  const requireLogin = async (to: any, from: any, next: any) => {
    let response = await getLoggedinUser();
    if (to.meta.auth) {
      if (response.status !== 200) {
        next.redirect("/login");
      }
      next();
    } else {
      next();
    }
  };

  return (
    <div>
      <TopNavBar />
      <Router>
        <GuardProvider guards={[requireLogin]} loading={"/"} error={"/"}>
          <Switch>
            <GuardedRoute path="/" exact component={LandingPage} />
            <GuardedRoute
              path="/profile/*"
              exact
              component={ProfilePage}
              meta={{ auth: true }}
            />
            <GuardedRoute
              path="/achievements/*"
              exact
              component={AchievementPage}
            />
            <GuardedRoute path="/teams" exact component={TeamsPage} meta={{ auth: true }}/>
            <GuardedRoute path="/login" exact component={LoginPage} />
            <GuardedRoute path="/register" exact component={RegisterPage} />
            <GuardedRoute
              path="/createtournament"
              exact
              component={CreateTournamentPage}
              meta={{ auth: true }}
            />
            <GuardedRoute
              path="/teamfinder"
              exact
              component={TeamFinderPage}
              meta={{ auth: true }}
            />
            <GuardedRoute
              path="/createlobby"
              exact
              component={CreateLobbyPage}
              meta={{ auth: true }}
            />
            <GuardedRoute
              path="/lobby/:id"
              exact
              component={LobbyPage}
              meta={{ auth: true }}
            />
            <GuardedRoute
              path="/tournament/*"
              exact
              component={TournamentPage}
              meta={{ auth: true }}
            />
            <GuardedRoute
              path="/messages"
              exact
              component={MessagePage}
              meta={{ auth: true }}
            />
            <GuardedRoute
              path="/createGame"
              exact
              component={CreateGamePage}
              meta={{ auth: true }}
            />
            <GuardedRoute
              path="/alltournaments"
              exact
              component={AllTournamentsPage}
              meta={{ auth: true }}
            />
            <GuardedRoute
              path="/profilesettings"
              exact
              component={ProfileSettingsPage}
              meta={{ auth: true }}
            />
            <GuardedRoute
              path="/followinfo/*"
              exact
              component={FollowInfoPage}
              meta={{ auth: true }}
            />
            <GuardedRoute
              path="/edittournament/*"
              exact
              component={EditTournamentPage}
              meta={{ auth: true }}
            />
          </Switch>
        </GuardProvider>
      </Router>
    </div>
  );
}

export default FullPage;
