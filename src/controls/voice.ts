import { Command } from "../core"

const speechRecognition: any = (window.SpeechRecognition || window.webkitSpeechRecognition)
const homonyms: Map<Command, string[]> = new Map()

homonyms.set(Command.Start, ['stop', 'tart', 'next'])
homonyms.set(Command.Left, ['lift', 'lyft', 'let', "let's", "late", "list", "west", "reflect", "like", "lights"])
homonyms.set(Command.Right, ['write', 'wright', 'bright', "east", "fright"])
homonyms.set(Command.Down, ["don't know", "don't", "doan", "done", "dumb", "dawn", "$", "south", "sauce", "twown", "on", "donna", "down", "doll"])
homonyms.set(Command.Up, ['oak', 'hope', "north", "notes", "nose"])

function matchCommands(cmd: string, msg: string) {
    for (const text of homonyms.get(cmd)) {
        if (msg.indexOf(text) === -1) continue
        return msg.replace(text, cmd)
    }
    return msg
}

function process(msg: string) {
    let txt = msg.toLowerCase().trim()

    for (const cmd of homonyms.keys()) {
        txt = matchCommands(cmd, txt)
    }
    return txt.trim().split(' ').filter(x => homonyms.has(x as Command)).map(x => x as Command)
}

export function voiceRecognitionStart(callback: (cmd: Command[]) => void) {
    const recognition: SpeechRecognition = new speechRecognition()

    recognition.continuous = false
    recognition.lang = 'en-US'
    recognition.maxAlternatives = 3
    recognition.interimResults = true

    // let processed = 0
    // recognition.onaudiostart = (evt) => console.log('onaudiostart', evt)
    // recognition.onaudioend = (evt) => console.log('onaudioend', evt)
    // recognition.onerror = (evt) => console.log('onerror', evt)
    recognition.onend = () => {
        // console.log('onend', evt)
        recognition.start()
    }
    recognition.onresult = function (evt: any) {
        // if (evt.resultIndex <= processed) return

        var interim_transcript = ''
        var final_transcript = ''
        var requiredConfidence = 0.75
        for (var i = evt.resultIndex; i < evt.results.length; ++i) {
            if (evt.results[i].confidence <= requiredConfidence) continue
            if (evt.results[i].isFinal) {
                final_transcript += evt.results[i][0].transcript;
            } else {
                interim_transcript += evt.results[i][0].transcript;
            }
        }

        console.log(evt, `${interim_transcript} || ${final_transcript} => ${process(final_transcript)}`)

        let resInter = process(interim_transcript)
        if (resInter && resInter.length > 0) {
            recognition.abort()
            // processed = evt.resultIndex
            return callback(resInter)
        }

        let resFinal = process(final_transcript)
        if (resFinal && resFinal.length > 0) {
            recognition.abort()
            // processed = evt.resultIndex
            return callback(resFinal)
        }
    }
    recognition.start()
}