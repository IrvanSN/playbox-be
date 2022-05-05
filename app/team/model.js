const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required!'],
    },
    email: {
      type: String,
      validate: {
        validator: (value) => validator.isEmail(value),
        message: 'Email is not a valid email address! ex: foo@bar.com',
      },
      unique: [true, 'Email is already registered!'],
      required: [true, 'Email is required!'],
    },
    phone: {
      type: String,
      validate: {
        validator: (value) => validator.isMobilePhone(value, ['id-ID']),
        message: 'Phone number is not valid, ex 08xxxx or 62xxxx',
      },
      required: [true, 'Phone number is required!'],
    },
    password: {
      type: String,
      minLength: [6, 'Password less than 6 characters!'],
      required: [true, 'Password is required'],
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
        default: `${process.env.IMG_URL}/avatar.png`,
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
        default: `${process.env.IMG_URL}/avatar.png`,
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
        default: `${process.env.IMG_URL}/avatar.png`,
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
    paymentSessionId: {
      type: String,
    },
    payment: {
      sessionId: {
        type: String,
      },
      total: {
        type: Number,
      },
      via: {
        type: String,
      },
      status: {
        type: Boolean,
        default: false,
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
