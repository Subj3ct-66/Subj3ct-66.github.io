import { visit } from 'unist-util-visit';

const rehypeAddImageClasses = () => {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName === 'img') {
        node.properties.loading = 'lazy';
        node.properties.decoding = 'async';
      }
    });
  };
}

export default rehypeAddImageClasses;