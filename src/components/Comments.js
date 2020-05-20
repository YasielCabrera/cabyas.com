import React from 'react';
import { Disqus, CommentCount } from 'gatsby-plugin-disqus';

const Comments = ({ url }) => {
  let disqusConfig = {
    url: url,
    identifier: url,
  };

  return (
    <div>
      {/* <CommentCount config={disqusConfig} placeholder={'...'} /> */}

      <Disqus config={disqusConfig} />
    </div>
  );
};

export default Comments;
