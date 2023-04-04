/* eslint max-len: ["error", { "code": 90 }] */
const {
  slugify,
  slugifyUnderscore,
  getRepositoryOwner,
  getRepositoryName,
  getRefName,
  getShaShort,
  getHeadRefShort,
} = require('./index');

test('slugifies text', () => {
  expect(slugify(' /abc+bob*123/test§xyz ')).toEqual('abc-bob-123-test-xyz');
});

test('slugifies ref name with dash', () => {
  expect(slugify('feature/feature-branch-1')).toEqual('feature-feature-branch-1');
});

test('slugify replace all special chars with underscores ', () => {
  expect(slugifyUnderscore('feature/_$%feature-branch-1'))
      .toEqual('feature____feature_branch_1');
});
test('slugifies empty text', () => {
  expect(slugify('')).toEqual('');
});

test('gets repository owner', () => {
  expect(getRepositoryOwner('remotecompany/envs-action')).toEqual('remotecompany');
});

test('gets repository owner for empty repository', () => {
  expect(getRepositoryOwner(undefined)).toBeFalsy();
});

test('gets repository name from repository', () => {
  expect(getRepositoryName('remotecompany/envs-action')).toEqual('envs-action');
});

test('gets repository name for empty repository', () => {
  expect(getRepositoryName(undefined)).toBeFalsy();
});

test('gets ref name from simple ref', () => {
  expect(getRefName('refs/heads/feature-branch-1')).toEqual('feature-branch-1');
});

test('gets ref name from tag', () => {
  expect(getRefName('refs/tags/v1.0.0')).toEqual('v1.0.0');
});

test('gets ref name for empty ref', () => {
  expect(getRefName(undefined)).toBeFalsy();
});

test('gets short SHA', () => {
  expect(getShaShort('00ac537a6cbbf934b08745a378932722df287a53')).toEqual('00ac537a');
});

test('gets short SHA for empty SHA', () => {
  expect(getShaShort(undefined)).toBeFalsy();
});

test('headRef is 60 characters long', () => {
  expect(getHeadRefShort('feature/this-is-ne-very-very-very-long-branch-name-for-no-good-reason')).toHaveLength(60);
});