import express = require('express');
import Account from '../models/account';

var router = express.Router();

export let index = router.get('/', function (req, res, next) {
  res.render('index');
});

//TODO: /test 와 /test/u/:id 합치는 방법
export let test = router.get('/test', function (req, res, next) {
  const accounts = JSON.parse(getCookie(req.headers.cookie, 'accounts'));

  // 등록된 계정 없을시 login 페이지로 redirect & 있으면 가장 최근 로그인 계정으로!
  if (accounts.length == 0) {
    res.redirect('/login');
  } else {
    var last_logined_account = accounts.sort((a1: Account, a2: Account) => a1.last_logined_at < a2.last_logined_at)[0];
    res.redirect('/test/u/' + last_logined_account.position);
  }
});

export let test_logined = router.get('/test/u/:id', function (req, res, next) {
  const accounts: Array<Account> = JSON.parse(getCookie(req.headers.cookie, 'accounts'));

  // 잘못된 id로 접근 시, login 페이지로 redirect
  if (!Number.isInteger(Number(req.params.id)) || Number(req.params.id) >= accounts.length) {
    res.redirect('/login');
  } else {
    var email = accounts.filter(account => account.position == Number(req.params.id))[0].email;
    res.render('test', { email: email });
  }
});

export let login = router.get('/login', function (req, res, next) {
  res.render('login');
});

export let create = router.post('/create', function (req, res, next) {
  // TODO: email format validation
  // TODO: JWT 적용
  // TODO: 계정 삭제시 json 재배열

  let accounts: Array<Account> = JSON.parse(getCookie(req.headers.cookie, 'accounts'));

  if (accounts.filter(account => account.email == req.body.email).length > 0) { // 중복된 계정 등록 방지
    res.json({ 'status': 'duplicated' });
  } else if (req.body.email == '') { // empty string 등록 방지
    res.json({ 'status': 'fail' });
  } else {
    accounts.push(new Account(accounts.length, req.body.email, Date.now()))

    res.json({ 'status': 'success', 'accounts': accounts, 'id': accounts.length - 1 })
  }
});

export function getCookie(cookie: any, name: string) {
  const value = "; " + cookie;
  const parts: any = value.split("; " + name + "=");

  if (parts.length == 2) {
    return parts.pop().split(";").shift();
  } else {
    return '[]'
  }
}