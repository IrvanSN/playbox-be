const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const teamSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
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
      default: '',
    },
    status: {
      type: Boolean,
      default: false,
    },
    member_one: {
      name: {
        type: String,
        default: '',
      },
      email: {
        type: String,
        default: '',
      },
      institution: {
        type: String,
        default: '',
      },
      phone: {
        type: String,
      },
      id_image: {
        type: String,
        default: '',
      },
      profile_image: {
        type: String,
        default: '',
      },
      role: {
        type: String,
        default: '',
      },
    },
    member_two: {
      name: {
        type: String,
        default: '',
      },
      email: {
        type: String,
        default: '',
      },
      institution: {
        type: String,
        default: '',
      },
      phone: {
        type: String,
      },
      id_image: {
        type: String,
        default: '',
      },
      profile_image: {
        type: String,
        default: '',
      },
      role: {
        type: String,
        default: '',
      },
    },
    member_three: {
      name: {
        type: String,
        default: '',
      },
      email: {
        type: String,
        default: '',
      },
      institution: {
        type: String,
        default: '',
      },
      phone: {
        type: String,
      },
      id_image: {
        type: String,
        default: '',
      },
      profile_image: {
        type: String,
        default: '',
      },
      role: {
        type: String,
        default: '',
      },
    },
    idea: {
      title: {
        type: String,
        default: '',
      },
      description: {
        type: String,
        default: '',
      },
    },
  },
  {
    timestamps: true,
  }
);
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
