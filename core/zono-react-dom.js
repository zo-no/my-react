import { render } from "./zono-react.js";

export default {
  createRoot: (container) => {
    return {
      render: (el) => {
        render(el, container);
      },
    };
  },
};
