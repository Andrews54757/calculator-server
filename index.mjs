import IsolatedVM from "isolated-vm";
import Express from "express";


const isolate = new IsolatedVM.Isolate({ memoryLimit: 8 });
const app = Express();
app.use(Express.json());

// API endpoint /eval
// POST
// body: string
// globals: object
app.post("/eval", async (req, res) => {

    const { body, globals } = req.body;

    if (typeof body !== "string") {
        res.status(400).json({ error: "body must be a string" });
        return;
    }

    if (typeof globals !== "object") {
        res.status(400).json({ error: "globals must be an object" });
        return;
    }

    // invalidate if script too long
    if (body.length > 10000) {
        res.status(400).json({ error: "body too long" });
        return;
    }

    // invalidate if too many globals
    if (Object.keys(globals).length > 3) {
        res.status(400).json({ error: "too many globals" });
        return;
    }

    // invalidate if globals are not numbers or strings
    for (const key in globals) {
        if (typeof globals[key] === "number") {
            continue;
        } else if (typeof globals[key] === "string") {
            if (globals[key].length > 100) {
                res.status(400).json({ error: key + " is too long" });
                return;
            }
            continue;
        }

        res.status(400).json({ error: "globals must be numbers or strings" });
        return;
    }

    const context = await isolate.createContext();
    const jail = context.global;
    jail.setSync("window", jail.derefInto());
    for (const key in globals) {
        jail.setSync(key, globals[key]);
    }

    let script, result;
    try {
        script = await isolate.compileScript(body);
    } catch (e) {
        res.status(400).json({ error: e.message });
        return;
    }

    try {
        result = await script.run(context, {
            timeout: 50,
            release: true,
        });
    } catch (e) {
        res.status(400).json({ error: e.message });
        return;
    }

    // invalidate if result is not a number or string
    if (typeof result !== "number" && typeof result !== "string") {
        res.status(400).json({ error: "result must be a number or string" });
        return;
    }

    // invalidate if result is too long
    if (typeof result === "string" && result.length > 100) {
        res.status(400).json({ error: "result too long" });
        return;
    }

    res.json({
        result
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Listening on port " + port);
});