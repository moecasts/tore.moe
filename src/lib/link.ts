import { getFilterConfig } from './filter';
import { normalize } from './normalize';
import { getPaginationConfig } from './posts';

const paginationConfig = getPaginationConfig();

export const getPaginateLink = (payload: { link: string; page?: number }) => {
  const { link, page } = payload;

  const result = (page || 0) > 1 ? `${link}/${paginationConfig.prefix}/${page}` : link;

  return normalize(result);
};

export const getCategoryLink = (payload: { category: string; page?: number }) => {
  const { category, page } = payload;

  return getPaginateLink({
    link: `/categories/${category}`,
    page,
  });
};

export const getTagLink = (payload: { tag: string; page?: number }) => {
  const { tag, page } = payload;
  return getPaginateLink({
    link: `/tags/${tag}`,
    page,
  });
};

export const getPortfoliosLink = (payload: { page?: number } = {}) => {
  const { page } = payload;

  return getPaginateLink({
    link: `/portfolios`,
    page,
  });
};

export const getPortfolioTagLink = (payload: { tag: string; page?: number }) => {
  const { tag, page } = payload;

  return getPaginateLink({
    link: `${getPortfoliosLink()}/tags/${tag}`,
    page,
  });
};

export const getFilterLink = (payload: { base: string; filter: string; page?: number }) => {
  const { base, filter, page } = payload;

  return getPaginateLink({
    link: `${base}/${getFilterConfig()?.column}/${filter}`,
    page,
  });
};

export const getCategoryFilterLink = (payload: {
  category: string;
  filter: string;
  page?: number;
}) => {
  const { category, filter, page } = payload;

  return getPaginateLink({
    link: `/categories/${category}/${getFilterConfig()?.column}/${filter}`,
    page,
  });
};
