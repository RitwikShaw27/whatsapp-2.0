import { Avatar, Button, IconButton } from "@material-ui/core";
import styled from "styled-components";
import ChatIcon from "@material-ui/icons/Chat";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SearchIcon from "@material-ui/icons/Search";
import * as EmailValidator from "email-validator";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, db } from "../firebase";
import Chat from "./Chat";
import { useState } from "react";
import getRecipientEmail from "../utils/getRecipientEmail.js";

function Sidebar() {
  const [wordToBeSearched, setWordToBeSearched] = useState("");
  const [user] = useAuthState(auth);
  const userChatRef = db
    .collection("chats")
    .where("users", "array-contains", user.email);
  const [chatsSnapshot] = useCollection(userChatRef);

  const createChat = () => {
    const input = prompt(
      "Please enter an email address for the user you wish to chat with: "
    );

    if (!input) return null;

    if (
      EmailValidator.validate(input) &&
      !chatAlreadyExists(input) &&
      input != user.email
    ) {
      // We need to add the chat into the DB 'chats' collection if it doesnt already exists and is valid
      db.collection("chats").add({
        users: [user.email, input],
      });
      alert("New chat created!");
    } else {
      alert("User already exists in your chat list!");
    }
  };

  const chatAlreadyExists = (recipientEmail) =>
    !!chatsSnapshot?.docs.find(
      (chat) =>
        chat.data().users.find((user) => user === recipientEmail)?.length > 0
    );

  return (
    <Container>
      <Header>
        <UserAvatar
          src={user.photoURL}
          onClick={() => {
            confirm("Log out?") && auth.signOut();
          }}
        />

        <IconsContainer>
          <IconButton>
            <ChatIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </IconsContainer>
      </Header>

      <Search>
        <SearchIcon />
        <SearchInput
          value={wordToBeSearched}
          onChange={(e) => setWordToBeSearched(e.target.value)}
          placeholder="Search in chat"
        />
      </Search>

      <SidebarButton onClick={createChat}>Start a new chat</SidebarButton>

      {/* Lists of Chat 1:40:00*/}
      {chatsSnapshot?.docs.map((chat) => {
        return (
          chat
            .data()
            .users.find((u) => u === getRecipientEmail(chat.data().users, user))
            .includes(wordToBeSearched) && (
            <Chat key={chat.id} id={chat.id} users={chat.data().users} />
          )
        );
      })}
    </Container>
  );
}

export default Sidebar;

const Container = styled.div`
  flex: 0.45;
  border-right: 1px solid whitesmoke;
  height: 100vh;
  min-width: 300px;
  max-width: 350px;
  overflow-y: scroll;

  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const Search = styled.div`
  display: flex;
  align-items: center;
  padding: 16px;
  border-radius: 3px;
`;

const SearchInput = styled.input`
  outline-width: 0;
  border: none;
  border-radius: 10px;
  flex: 1;
  padding: 15px;
  background-color: whitesmoke;
`;

const SidebarButton = styled(Button)`
  width: 100%;
  &&& {
    border-top: 1px solid whitesmoke;
    border-bottom: 1px solid whitesmoke;
  }
`;

const Header = styled.div`
  display: flex;
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  height: 80px;
  border-bottom: 1px solid whitesmoke;
`;

const UserAvatar = styled(Avatar)`
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
`;

const IconsContainer = styled.div``;
