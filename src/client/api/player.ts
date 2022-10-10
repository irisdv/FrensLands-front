// export default const getUserInfo = async (account: string) => {
export default async function getPlayer(account: string) {
  fetch("http://localhost:3001/api/users/signin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ account }),
  })
    .then(async (response) => {
      return await response.json();
    })
    .then((data) => {
      console.log(
        "userData received, ready to initialize game session withat data : ",
        data
      );
    });
}

// const getUserSettings = async (account: string) => {
//   await fetch(`http://localhost:3001/api/users/${account}`, {
//     headers: { "x-access-token": localStorage.getItem("user") as string },
//   })
//     .then(async (response) => {
//       return await response.json();
//     })
//     .then((data) => {
//       console.log("data of player retrieved", data);
//       if (data) {
//         initSettings(data.setting);
//         // Init player new game session
//         initGameSession(
//           data.inventory,
//           data.land,
//           data.player_actions,
//           data.player_buildings
//         );
//       }
//       return data.setting.zoom;
//     });
// };
