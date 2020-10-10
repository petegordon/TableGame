export default class ConferenceRoom {
  constructor(serverURL, roomId, JitsiMeetJS, $, connected, disconnected) {
    this.connectedFunction = connected;
    this.disconnectedFunction = disconnected;

    this.options = {
      hosts: {
        domain: serverURL,
        muc: `conference.${serverURL}`, // FIXME: use XEP-0030
      },
      serviceUrl: `wss://${serverURL}/xmpp-websocket?room=${roomId}`,
      clientNode: `https://${serverURL}`,
    };

    this.roomId = roomId;

    /*
    this.confOptions = {
      openBridgeChannel: true,
    };
    */
    this.confOptions = {};

    this.connection = null;
    this.isJoined = false;
    this.room = null;

    this.localTracks = [];
    this.remoteTracks = {};

    this.isVideo = true;

    //    $(window).bind("beforeunload", unload);
    //    $(window).bind("unload", unload);

    this.initOptions = {
      disableAudioLevels: true,
    };

    JitsiMeetJS.setLogLevel(JitsiMeetJS.logLevels.DEBUG);

    JitsiMeetJS.init(this.initOptions);

    this.connection = new JitsiMeetJS.JitsiConnection(null, null, this.options);

    this.connection.addEventListener(
      JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED,
      this.onConnectionSuccess.bind(this)
    );
    this.connection.addEventListener(
      JitsiMeetJS.events.connection.CONNECTION_FAILED,
      this.onConnectionFailed.bind(this)
    );
    this.connection.addEventListener(
      JitsiMeetJS.events.connection.CONNECTION_DISCONNECTED,
      this.onConnectionDisconnected.bind(this)
    );

    this.connection.connect();

    JitsiMeetJS.createLocalTracks({ devices: ["audio", "video"] })
      .then(this.onLocalTracks.bind(this))
      .catch((error) => {
        throw error;
      });
  }
  /**
   * Handles local tracks.
   * @param tracks Array with JitsiTrack objects
   */
  onLocalTracks(tracks) {
    console.log(this);
    this.localTracks = tracks;
    for (let i = 0; i < this.localTracks.length; i++) {
      this.localTracks[i].addEventListener(
        JitsiMeetJS.events.track.TRACK_AUDIO_LEVEL_CHANGED,
        (audioLevel) => console.log(`Audio Level local: ${audioLevel}`)
      );
      this.localTracks[i].addEventListener(
        JitsiMeetJS.events.track.TRACK_MUTE_CHANGED,
        () => console.log("local track muted")
      );
      this.localTracks[i].addEventListener(
        JitsiMeetJS.events.track.LOCAL_TRACK_STOPPED,
        () => console.log("local track stoped")
      );
      this.localTracks[i].addEventListener(
        JitsiMeetJS.events.track.TRACK_AUDIO_OUTPUT_CHANGED,
        (deviceId) =>
          console.log(`track audio output device was changed to ${deviceId}`)
      );
      if (this.localTracks[i].getType() === "video") {
        $("#avContainer").append(`<video autoplay='1' id='localVideo${i}' />`);
        this.localTracks[i].attach($(`#localVideo${i}`)[0]);
      } else {
        $("#avContainer").append(
          `<audio autoplay='1' muted='true' id='localAudio${i}' />`
        );
        this.localTracks[i].attach($(`#localAudio${i}`)[0]);
      }
    }
  }
  /**
   * Handles remote tracks
   * @param track JitsiTrack object
   */
  onRemoteTrack(track) {
    if (track.isLocal()) {
      return;
    }
    const participant = track.getParticipantId();

    if (!this.remoteTracks[participant]) {
      this.remoteTracks[participant] = [];
    }
    const idx = this.remoteTracks[participant].push(track);

    track.addEventListener(
      JitsiMeetJS.events.track.TRACK_AUDIO_LEVEL_CHANGED,
      (audioLevel) => console.log(`Audio Level remote: ${audioLevel}`)
    );
    track.addEventListener(JitsiMeetJS.events.track.TRACK_MUTE_CHANGED, () =>
      console.log("remote track muted")
    );
    track.addEventListener(JitsiMeetJS.events.track.LOCAL_TRACK_STOPPED, () =>
      console.log("remote track stoped")
    );
    track.addEventListener(
      JitsiMeetJS.events.track.TRACK_AUDIO_OUTPUT_CHANGED,
      (deviceId) =>
        console.log(`track audio output device was changed to ${deviceId}`)
    );
    const id = participant + track.getType() + idx;

    if (track.getType() === "video") {
      $("#avContainer").append(
        `<video autoplay='1' id='${participant}video${idx}' />`
      );
    } else {
      $("#avContainer").append(
        `<audio autoplay='1' id='${participant}audio${idx}' />`
      );
    }
    track.attach($(`#${id}`)[0]);
  }
  /**
   * That function is executed when the conference is joined
   */
  onConferenceJoined() {
    console.log("room joined!");

    this.isJoined = true;
    for (let i = 0; i < this.localTracks.length; i++) {
      this.room.addTrack(this.localTracks[i]);
    }
  }
  onConferenceLeft() {
    console.log("room left!");
    /*    
    this.isJoined = false;
    for (let i = 0; i < this.localTracks.length; i++) {
      this.room.removeTrack(this.localTracks[i]);
    }
*/
  }

  /**
   *
   * @param id
   */
  onUserLeft(id) {
    console.log("user left");
    console.log(id);
    console.log(this.remoteTracks);

    if (!this.remoteTracks && !this.remoteTracks[id]) {
      return;
    }
    const tracks = this.remoteTracks[id];

    for (let i = 0; i < tracks.length; i++) {
      try {
        tracks[i].detach($(`#${id}${tracks[i].getType()}`));
      } catch (error) {
        console.error(error);
      }
      console.log(`#${id}${tracks[i].getType()}${i}`);
      $(`#${id}${tracks[i].getType()}${i}`).remove();
    }
  }
  async joinConferenceRoom(newRoom) {
    console.log(this.room);
    if (this.room) {
      console.log("start leave");
      console.log(this.room.options.name);
      await this.room.leave();
      console.log("end leave");
      console.log(this.room.options.name);
    }

    console.log(this.roomId);
    console.log(newRoom);
    if (newRoom != null) {
      this.roomId = newRoom;
    }
    console.log(this.roomId);

    this.room = this.connection.initJitsiConference(
      this.roomId,
      this.confOptions
    );
    this.room.on(
      JitsiMeetJS.events.conference.TRACK_ADDED,
      this.onRemoteTrack.bind(this)
    );
    this.room.on(JitsiMeetJS.events.conference.TRACK_REMOVED, (track) => {
      console.log(`track removed!!!${track}`);
    });
    this.room.on(
      JitsiMeetJS.events.conference.CONFERENCE_JOINED,
      this.onConferenceJoined.bind(this)
    );
    this.room.on(
      JitsiMeetJS.events.conference.CONFERENCE_LEFT,
      this.onConferenceLeft.bind(this)
    );

    this.room.on(JitsiMeetJS.events.conference.USER_JOINED, (id) => {
      console.log("user join:" + id);
      this.remoteTracks[id] = [];
    });
    this.room.on(
      JitsiMeetJS.events.conference.USER_LEFT,
      this.onUserLeft.bind(this)
    );
    this.room.on(JitsiMeetJS.events.conference.TRACK_MUTE_CHANGED, (track) => {
      console.log(`${track.getType()} - ${track.isMuted()}`);
    });
    this.room.on(
      JitsiMeetJS.events.conference.DISPLAY_NAME_CHANGED,
      (userID, displayName) => console.log(`${userID} - ${displayName}`)
    );
    this.room.on(
      JitsiMeetJS.events.conference.TRACK_AUDIO_LEVEL_CHANGED,
      (userID, audioLevel) => console.log(`${userID} - ${audioLevel}`)
    );
    this.room.on(JitsiMeetJS.events.conference.PHONE_NUMBER_CHANGED, () =>
      console.log(`${this.room.getPhoneNumber()} - ${this.room.getPhonePin()}`)
    );
    this.room.join();
  }
  /**
   * That function is called when connection is established successfully
   */
  onConnectionSuccess() {
    console.log("connection established successfully!");
    this.joinConferenceRoom();

    this.connectedFunction();
  }
  /**
   * This function is called when the connection fail.
   */
  onConnectionFailed() {
    console.error("Connection Failed!");
  }

  /**
   * This function is called when we disconnect.
   */
  onConnectionDisconnected() {
    console.log("disconnect!");
    this.connection.removeEventListener(
      JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED,
      this.onConnectionSuccess.bind(this)
    );
    this.connection.removeEventListener(
      JitsiMeetJS.events.connection.CONNECTION_FAILED,
      this.onConnectionFailed.bind(this)
    );
    this.connection.removeEventListener(
      JitsiMeetJS.events.connection.CONNECTION_DISCONNECTED,
      this.onConnectionDisconnected.bind(this)
    );

    this.disconnectedFunction();
  }

  /**
   *
   */
  async unload() {
    for (let i = 0; i < this.localTracks.length; i++) {
      this.localTracks[i].dispose();
    }
    await this.room.leave();
    this.connection.disconnect();
  }
}
