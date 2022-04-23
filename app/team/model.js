const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const teamSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  category: {
    type: String,
  },
  institution: {
    type: String,
  },
  status: {
    type: Boolean,
  },
  members: [
    {
      id_image: {
        type: String,
      },
      profile_image: {
        type: String,
      },
      role: {
        type: String,
      },
    },
  ],
  idea: {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
  },
});

teamSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
});

teamSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) {
    throw Error('Email/Password Salah!');
  }

  const auth = await bcrypt.compare(password, user.password);
  if (!auth) {
    throw Error('Email/Password Salah!');
  }

  return user;
};

const Team = mongoose.model('team', teamSchema);
module.exports = Team;
