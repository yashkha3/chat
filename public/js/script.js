var socket = io();
var sendNotificaton = (type, text) => {
  let notificationBox = document.querySelector(".notification-box");
  const alerts = {
    info: {
      icon: ``,
      color: "blue-500"
    },
    error: {
      icon: `<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
</svg>`,
      color: "red-500"
    },
    warning: {
      icon: `<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
</svg>`,
      color: "yellow-500"
    },
    success: {
      icon: `<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
</svg>`,
      color: "green-500"
    }
  };
  let component = document.createElement("div");
  component.className = `relative flex items-center bg-${alerts[type].color} text-white text-sm font-bold px-4 py-3 rounded-md opacity-0 transform transition-all duration-500 mb-1`;
  component.innerHTML = `${alerts[type].icon}<p>${text}</p>`;
  notificationBox.appendChild(component);
  setTimeout(() => {
    component.classList.remove("opacity-0");
    component.classList.add("opacity-1");
  }, 1); //1ms For fixing opacity on new element
  setTimeout(() => {
    component.classList.remove("opacity-1");
    component.classList.add("opacity-0");
    //component.classList.add("-translate-y-80"); //it's a little bit buggy when send multiple alerts
    component.style.margin = 0;
    component.style.padding = 0;
  }, 5000);
  setTimeout(() => {
    component.style.setProperty("height", "10", "important");
  }, 5100);
  setTimeout(() => {
    notificationBox.removeChild(component);
  }, 5700);
};
var nam = document.getElementById('name').value;
var room = document.getElementById('room').value;
console.log(nam, room);
sendNotificaton('info', 'Welcome');
var setUsername = () => {
  socket.emit('setUsername', { name: document.getElementById('name').value, room: document.getElementById('room').value });
};

var whileTyping = () => {
  
  var messageBox = document.getElementById('message');
  messageBox.addEventListener('keypress', () => {
    socket.emit('typing');
  });
};

var typingEnd = () => {
  
  var messageBox = document.getElementById('message');
  messageBox.addEventListener('keydown', () => {
    socket.emit('typingEnd');
  });
};

var sendMessage = () => {
  var msg = document.getElementById('message').value;
  if(msg){
    socket.emit('msg', msg);
    document.getElementById("message").value = ""; 
  }
};

var lastmessage = () => {
  var objDiv = document.getElementById("chat"); 
  objDiv.scrollTop=objDiv.scrollHeight;
};

var scrollTooltip = () => {
  var objDiv = document.getElementById("tooltip"); 
  objDiv.scrollTop=objDiv.scrollHeight;
};

// socket.on('broadcast', (data) => {
//   document.getElementById('count').innerHTML = `Users Online: ${data}`;
// });

socket.on('userExist', (data) => {
  sendNotificaton('error', data);
});

socket.on('name_notification', (data) => {
  sendNotificaton('error', data);
});

socket.on('roomSetup', (data) => {
  document.getElementById('top').innerHTML = "Socket.io Chat";
  document.getElementById('middle').innerHTML = `Room: ${data.room}`;
    document.getElementById('chat').innerHTML = "";
    document.getElementById('room').outerHTML = "";
    document.getElementById('count').innerHTML = "";
  document.getElementById('name').outerHTML = `<input id="message" type="text" name="name" value="" onkeypress="whileTyping()" onkeyup="typingEnd()" class="msger-input" placeholder="Enter the Message">`;
  document.getElementById('press').outerHTML = `<button type="button" value="" onclick="sendMessage()" class="msger-send-btn">Send</button>`;
});

socket.on('roomData', (data) => {
  console.log(data)
  document.getElementById('count').innerHTML = `${data.length} users in Room.`;
 });

socket.on('in_notification', (data) => {
  sendNotificaton('success', data);
});

socket.on('in_info', (data) => {
  document.getElementById('chat').innerHTML +=`<div class="msg msgad">
  <div class="msg-bubble stat">
    <div class="msg-text">
      ${data}
    </div>
    </div>
</div>`;
lastmessage();
});

socket.on('typing_message', (data) => {
  document.getElementById('title').innerHTML = data +" is typing" ;
});

socket.on('typing_message_end', () => {
  document.getElementById('title').innerHTML = "Socket.io Chat" ;
});

socket.on('send_msg', (data) => {
  document.getElementById('chat').innerHTML +=`<div class="msg right-msg">
  <div
   class="msg-img"
   style="background-image: url(https://image.flaticon.com/icons/svg/660/660611.svg)"
  ></div>

  <div class="msg-bubble">
    <div class="msg-info">
      <div class="msg-info-name">${data.user}</div>
      <div class="msg-info-time">${new Date().getHours()}:${new Date().getMinutes()}</div>
    </div>

    <div class="msg-text">
      ${data.message} 
    </div>
  </div>
</div>`;
lastmessage();
});

socket.on('recive_msg', (data) => {
  if(data.socket_id == socket.id){
  }else{
      document.getElementById('chat').innerHTML +=`<div class="msg left-msg">
      <div
      class="msg-img"
      style="background-image: url(https://image.flaticon.com/icons/svg/660/660611.svg)"
      ></div>

      <div class="msg-bubble">
        <div class="msg-info">
          <div class="msg-info-name">${data.user}</div>
          <div class="msg-info-time">${new Date().getHours()}:${new Date().getMinutes()}</div>
        </div>

        <div class="msg-text">
          ${data.message} 
        </div>
      </div>
    </div>`;
    lastmessage();
  }
});

socket.on('out_info', (data) => {
  document.getElementById('chat').innerHTML +=`<div class="msg msgad">
  <div class="msg-bubble rem">
    <div class="msg-text">
      ${data}
    </div>
    </div>
</div>`;
lastmessage();
});

const button = document.querySelector('button')
const tooltip = document.querySelector('.tooltip')
Popper.createPopper(button, tooltip)
var toggle = () => {
  tooltip.classList.toggle('shown');
  scrollTooltip();
};
document.querySelector('emoji-picker').addEventListener('emoji-click', (event) => {
document.getElementById("name").value += event.detail.unicode; 
});
document.querySelector('emoji-picker').addEventListener('emoji-click', (event) => {
document.getElementById("message").value += event.detail.unicode; 
});
