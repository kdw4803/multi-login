export default class Account {

  email: String;
  position: Number;
  last_logined_at: Number;

  constructor(position: Number, email: String, last_logined_at: Number) {
    this.email = email;
    this.position = position;
    this.last_logined_at = last_logined_at;
  }
}