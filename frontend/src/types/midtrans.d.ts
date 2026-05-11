interface MidtransResult {
  order_id: string;
  transaction_status: string;
  payment_type?: string;
  [key: string]: string | undefined;
}

interface SnapPayOptions {
  onSuccess?: (result: MidtransResult) => void;
  onPending?: (result: MidtransResult) => void;
  onError?: (result: MidtransResult) => void;
  onClose?: () => void;
}

interface Snap {
  pay: (token: string, options: SnapPayOptions) => void;
}

declare global {
  interface Window {
    snap?: Snap;
  }
}

export {};
