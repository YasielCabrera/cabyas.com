import React from 'react';
import { Disqus, CommentCount } from 'gatsby-plugin-disqus';

const Comments = ({ url }) => {
  let disqusConfig = {
    url: url,
    identifier: url,
  };

  return <Disqus config={disqusConfig} />;
};

export default Comments;
