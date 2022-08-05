import type { Achievement } from "../model/achievement";

export const allAchievements: Achievement[] = [
    {
        level: 1,
        goal: "Your first goal is to repair your cabin. For this you'll need wood.",
        description: `gm fren, welcome in Frend Lands ! We'll walk you through the first steps to play this pre-alpha version. If you don't want to see these updates in the future you can disable them by clicking on the button on the top right corner of the screen.`,
        unlock: []
    },
    {
        level: 2,
        goal: "Build your first farm. You'll first need to build houses to bring more frens into your community.",
        description: "Congrats ! Two new frens arrived in your community! You'll be sharing your cabin with them. Your frens need more food now.",
        unlock: [4, 16]
    },
    {
        level: 3,
        goal: "Produce some energy. Build a coal plant.",
        description: "You built your first farm ! Your farm is fueled for the next 3 blocks. It will bring you 3 food every block. Once the 3 blocks passed you can fuel your farm so it continues producing more food.",
        unlock: [21]
    },
    {
        level: 4,
        goal: "Your frens have to go a long way out of your community to get some basic products, you need to build a grocery shop & a bakery",
        description: "You can now produce energy! Your coal plant is recharged for the next 3 blocks then you can fuel it. It will bring you 2 energy / block.",
        unlock: [7, 8, 18, 19]
    },
    {
        level: 5,
        goal: "Your frens are bored on weekends... Build a bar and a restaurant.",
        description: "Frens are delighted by these new shops, especially the bakery !",
        unlock: [9, 11, 25, 26]
    },
    {
        level: 6,
        goal: "Build a police station.",
        description: "Nice parties ahead ! So many frens joining your community, last weekend some frens went a bit too far... It's time to bring some order into your community.",
        unlock: [22]
    },
    {
        level: 7,
        goal: "Build appartments.",
        description: "Frens are feeling safe again! Frens have voted, a police station should be built for every 20 buildings. Your community is ready to go to the next level.",
        unlock: [5, 15, 23, 12, 17]
    },
    {
        level: 8,
        goal: "Build all the existing buildings.",
        description: "",
        unlock: [6, 10, 13, 14, 24]
    },

]