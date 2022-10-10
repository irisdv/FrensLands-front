export const getStaticBuildings = async () => {
  return await fetch("http://localhost:3001/api/static_buildings", {
    headers: { "Content-Type": "application/json" },
  })
    .then(async (response) => await response.json())
    .then((data) => {
      console.log("static buildings retrieved", data);
      return data;
    });
};

export const getStaticResources = async () => {
  return await fetch("http://localhost:3001/api/static_resources_spawned", {
    headers: { "Content-Type": "application/json" },
  })
    .then(async (response) => await response.json())
    .then((data) => {
      console.log("static resources spawned retrieved", data);
      return data;
    })
    .catch((error) => {
      console.log("error", error);
    });
};
