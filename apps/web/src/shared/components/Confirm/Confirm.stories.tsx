import type { Meta, StoryObj } from '@storybook/react-vite';
import { ConfirmProvider, useConfirm } from './Confirm';
import { Button } from '@/shared/components/Button';

/**
 * Confirm is a context-mounted modal: there's no JSX surface to render
 * directly. Stories trigger it through the `useConfirm()` hook.
 */
const meta = {
  title: 'App/Confirm',
  component: ConfirmProvider,
  args: { children: null },
  parameters: { layout: 'centered' },
} satisfies Meta<typeof ConfirmProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

const Trigger = ({
  destructive,
  title,
  description,
  confirmLabel,
}: {
  destructive?: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
}) => {
  const confirm = useConfirm();
  return (
    <Button
      variant={destructive ? 'destructive' : 'primary'}
      onClick={async () => {
        const ok = await confirm({ title, description, confirmLabel, destructive });
        // eslint-disable-next-line no-alert
        window.alert(ok ? 'Confirmed' : 'Cancelled');
      }}
    >
      {confirmLabel ?? 'Open dialog'}
    </Button>
  );
};

export const Standard: Story = {
  render: () => (
    <Trigger
      title="Submit your application?"
      description="We will send it to the company immediately."
      confirmLabel="Submit"
    />
  ),
};

export const Destructive: Story = {
  render: () => (
    <Trigger
      destructive
      title="Delete this cover letter?"
      description="This cannot be undone."
      confirmLabel="Delete"
    />
  ),
};
