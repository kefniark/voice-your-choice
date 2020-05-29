# Voice your Choice

## Description

Small Open Hack Prototype to experiment the current state of Web API about speech recognition.

![Logo](./logo.png)

## Conclusion

I managed to get something working but there are still lot of issues with those APIs:
* The quality of recognition doesnt seem to be super consistent
    * Score change quite a lot with just background noise
* Really slow, it takes between 1-3s to get the final result
    * It's possible to work with intermediate results, faster but they are even more inacurate :D
    * Seen some C library compiled to WASM on github, but haven't tested yet
* Browser implementation are far from good (example chrome ignore the `grammar` property)

I think their status "Experimental" is well deserved, and I don't recommend using them for real projects in their current state.

## Usage

### Dev

```sh
npm install
npm run dev
```