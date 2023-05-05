const core = require('@actions/core');
const github = require('@actions/github');

/**
 * Slugify a given string.
 * @param {string} inputString
 * @return {string} The slugified string.
 */
function slugify(inputString) {
  return inputString
      .toString()
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, ' ') // remove invalid chars
      .replace(/^\s+|\s+$/g, '') // trim
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/\-\-+/g, '-') // Replace multiple - with single -
      .replace(/^-+/, '') // Trim - from start of text
      .replace(/-+$/, ''); // Trim - from end of text
}
/**
 * Clean special chars and replace them with _ for a given string.
 * @param {string} inputString
 * @return {string} The slugified string.
 */
function slugifyUnderscore(inputString) {
  return inputString
      .toString()
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_') // remove invalid chars
      .replace(/^\s+|\s+$/g, '') // trim
      .replace(/^-+/, '') // Trim - from start of text
      .replace(/-+$/, ''); // Trim - from end of text
}

/**
 * Get the repository owner from the repository string.
 * @param {string} repository
 * @return {string} The owner of the repository.
 */
function getRepositoryOwner(repository) {
  return repository ? repository.split('/')[0] : null;
}

/**
 * Get the repository name from the repository string.
 * @param {string} repository
 * @return {string} The name of the repository.
 */
function getRepositoryName(repository) {
  return repository ? repository.split('/')[1] : null;
}

/**
 * Get the ref name from the ref string.
 * @param {string} ref
 * @return {string} The ref name.
 */
function getRefName(ref) {
  return ref ? ref.split('/').slice(2).join('/') : null;
}

/**
 * Get the short SHA from the full SHA.
 * @param {string} fullSha
 * @return {string} The short SHA.
 */
function getShaShort(fullSha) {
  return fullSha ? fullSha.substring(0, 8) : null;
}

/**
 * Get the short headRef from the full headRef.
 * @param {string} headRef
 * @return {string} The short headRef.
 */
function getHeadRefShort(headRef) {
  return headRef ? headRef.substring(0, 60) : null;
}

try {
  // mailergroup/envs-action
  const repository = process.env.GITHUB_REPOSITORY;

  if (repository) {
    core.exportVariable('CI_REPOSITORY', repository);
    core.exportVariable('CI_REPOSITORY_SLUG', slugify(repository));
  }

  // mailergroup
  const repositoryOwner = getRepositoryOwner(repository);
  if (repositoryOwner) {
    core.exportVariable('CI_REPOSITORY_OWNER', repositoryOwner);
    core.exportVariable('CI_REPOSITORY_OWNER_SLUG', slugify(repositoryOwner));
  }

  // envs-action
  const repositoryName = getRepositoryName(repository);
  if (repositoryName) {
    core.exportVariable('CI_REPOSITORY_NAME', repositoryName);
    core.exportVariable('CI_REPOSITORY_NAME_SLUG', slugify(repositoryName));
  }

  // refs/heads/feat/feature-branch
  const ref = process.env.GITHUB_REF;

  if (ref) {
    core.exportVariable('CI_REF', ref);
    core.exportVariable('CI_REF_SLUG', slugify(ref));
  }

  const refName = getRefName(ref);

  if (refName) {
    core.exportVariable('CI_REF_NAME', refName);
    core.exportVariable('CI_REF_NAME_SLUG', slugify(refName));
  }

  const headRef = getHeadRefShort(process.env.GITHUB_HEAD_REF);
  const branchName = headRef || refName;

  if (branchName) {
    core.exportVariable('CI_ACTION_REF_NAME', branchName);
    core.exportVariable('CI_ACTION_REF_NAME_SLUG', slugify(branchName));
  }

  if (headRef) {
    core.exportVariable('CI_HEAD_REF', headRef);
    core.exportVariable('CI_HEAD_REF_SLUG', slugify(headRef));
    core.exportVariable('CI_CLEAN_HEAD_REF_SLUG', slugifyUnderscore(headRef));
  }

  const baseRef = process.env.GITHUB_BASE_REF;

  if (baseRef) {
    core.exportVariable('CI_BASE_REF', baseRef);
    core.exportVariable('CI_BASE_REF_SLUG', slugify(baseRef));
  }

  // i.e. ffac537e6cbbf934b08745a378932722df287a53
  const sha = process.env.GITHUB_SHA;

  if (sha) {
    core.exportVariable('CI_SHA', sha);
    core.exportVariable('CI_SHA_SHORT', getShaShort(sha));
  }

  // eslint-disable-next-line max-len
  const pullRequest = github.context.payload && github.context.payload.pull_request;
  if (pullRequest) {
    const prTitle = pullRequest.title;
    core.exportVariable('CI_PR_TITLE', prTitle);
    const prBody = pullRequest.body;
    core.exportVariable('CI_PR_DESCRIPTION', prBody);
  }

  core.exportVariable('CI_ACTOR', process.env.GITHUB_ACTOR);
  core.exportVariable('CI_EVENT_NAME', process.env.GITHUB_EVENT_NAME);
  core.exportVariable('CI_RUN_ID', process.env.GITHUB_RUN_ID);
  core.exportVariable('CI_RUN_NUMBER', process.env.GITHUB_RUN_NUMBER);
  core.exportVariable('CI_WORKFLOW', process.env.GITHUB_WORKFLOW);
  core.exportVariable('CI_ACTION', process.env.GITHUB_ACTION);
} catch (error) {
  core.setFailed(error.message);
}

module.exports = {
  slugify,
  slugifyUnderscore,
  getRepositoryOwner,
  getRepositoryName,
  getRefName,
  getShaShort,
  getHeadRefShort,
};
