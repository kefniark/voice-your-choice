export default {
    player: { x: -5, y: -5, visible: false },
    blocks: [],
    texts: [
        {
            x: 0.5,
            y: 0.5,
            value: `Congratulation !`,
            size: 40,
            animStrength: 0.2,
            animDuration: 0.05,
            voice: 0.05
        },
        {
            x: 0.5,
            y: 0.65,
            value: `You got it :p`,
            size: 24,
            animStrength: 0.2,
            animDuration: 0.05
        },
        {
            x: 0.88,
            y: 0.98,
            value: `say "Next" to continue`,
            size: 14,
            animStrength: 0.2,
            animDuration: 0.05
        },
        {
            x: 0.88,
            y: 0.98,
            value: `OK Google, tell me a joke !`,
            visible: false,
            voice: 2
        },
        {
            x: 0.88,
            y: 0.98,
            value: `Alexa, tell me a joke !`,
            visible: false,
            voice: 10
        }
    ]
}