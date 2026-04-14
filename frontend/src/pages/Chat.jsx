import React from 'react';
import Navbar from '../components/Navbar';
import ChatBox from '../components/ChatBox';

function Chat() {
  return (
    <div>
      <Navbar />
      <main className="chat-page">
        <h2>Chat Support</h2>
        <ChatBox />
      </main>
    </div>
  );
}

export default Chat;
