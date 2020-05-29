export default {
    player: { x: 3, y: 2, visible: true },
    blocks: [
        { id:"wall1", x: 6, y: 2, visible: false },
        { id:"wall2", x: 6, y: 1, visible: false },
        { id:"wall3", x: 6, y: 0, visible: false }
    ],
    coins: [
        { id: "coin1", x: 5, y: 2, visible: true },
        { id: "coin2", x: 7, y: 2, visible: false }
    ],
    goals: [
        { id: "goal1", x: 9, y: 2, visible: false }
    ],
    triggers: [
        { id:"appearcoin1", target: "coin2", set: { visible: true }, conditions: { coin: 1 } },
        { id:"appearwall1", target: "wall1", set: { visible: true }, conditions: { coin: 1 } },
        { id:"appearwall2", target: "wall2", set: { visible: true }, conditions: { coin: 1 } },
        { id:"appearwall3", target: "wall3", set: { visible: true }, conditions: { coin: 1 } },
        { id:"appeargoal", target: "goal1", set: { visible: true }, conditions: { coin: 2 } }
    ],
    texts: [
        { x: 0.1, y: 0.98, value: "Level 1: Try to get it !", size: 12, animStrength: 0.0001 }
    ]
}