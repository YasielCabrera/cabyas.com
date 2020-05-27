import React from 'react';
import { Disqus } from 'gatsby-plugin-disqus';

const Comments = ({ url, title }) => {
  let disqusConfig = {
    url: url,
    identifier: url,
    title: title,
  };

  return <Disqus config={disqusConfig} />;
};

export default Comments;
