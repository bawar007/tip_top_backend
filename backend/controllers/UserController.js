import Opinion, { Users } from "../models/UserModel.js";

export const getOpinions = async (req, res) => {
  try {
    const response = await Opinion.findAll();
    res.status(200).json(response);
    console.log(response + "działa");
  } catch (error) {
    console.log(error.message);
  }
};

export const getOpinionByEmail = async (req, res) => {
  try {
    const response = await Opinion.findOne({
      where: {
        email: req.params.email,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const getUsers = async (req, res) => {
  try {
    const response = await Users.findAll();
    res.status(200).json(response);
    console.log(response + "działa");
  } catch (error) {
    console.log(error.message);
  }
};

export const createOpinion = async (req, res) => {
  try {
    await Opinion.create(req.body);
    res.status(201).json({ msg: "User Created" });
  } catch (error) {
    console.log(error.message);
  }
};

export const updateOpinion = async (req, res) => {
  try {
    await Opinion.update(req.body, {
      where: {
        email: req.params.email,
      },
    });
    res.status(200).json({ msg: "User Updated" });
  } catch (error) {
    console.log(error.message);
  }
};

export const deleteOpinion = async (req, res) => {
  try {
    await Opinion.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ msg: "User Deleted" });
  } catch (error) {
    console.log(error.message);
  }
};
