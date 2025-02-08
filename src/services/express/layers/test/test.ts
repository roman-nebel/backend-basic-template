import { Router } from "express";

const test = Router();

test.get("/echo", (req, res) => {
  res.status(200).send(req.query);
});

test.post("/echo", (req, res) => {
  res.status(200).send(req.body);
});

export default test;
