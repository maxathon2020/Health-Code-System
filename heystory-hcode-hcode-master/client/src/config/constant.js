export const LOGIN_TOKEN = 'login_access_user'
export const DOMAIN = process.env.NODE_ENV === 'production' ? 'http://39.108.59.150' : 'http://192.168.0.102:7012'
export const SEX = [{
  key: '1',
  label: 'Male'
}, {
  key: '2',
  label: 'Female'
}]
export const HISTORY = [{
  key: '1',
  label: 'No'
}, {
  key: '2',
  label: 'Yes'
}]
export const HEALTH = [{
  key: '1',
  label: 'Healthy'
}, {
  key: '2',
  label: 'Fever, under 37.3'
}, {
  key: '3',
  label: 'Fever, above 37.3'
}, {
  key: '4',
  label: 'Dry cough'
}, {
  key: '5',
  label: 'Tiredness'
}, {
  key: '6',
  label: 'Others'
}]
