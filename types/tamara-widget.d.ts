// Type definitions for Tamara widget custom elements
declare namespace JSX {
  interface IntrinsicElements {
    "tamara-widget": {
      id?: string;
      type?: string;
      amount?: string;
      config?: string;
      "inline-type"?: string;
      children?: React.ReactNode;
    };
  }
}
