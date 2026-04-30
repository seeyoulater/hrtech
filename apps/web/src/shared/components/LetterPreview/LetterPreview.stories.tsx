import type { Meta, StoryObj } from '@storybook/react-vite';
import { LetterPreview } from './LetterPreview';

const SAMPLE_LETTER = `Dear Stripe Team,

I am excited to apply for the Senior Engineer position. With five years of experience in developer tooling, I have honed my skills in creating robust design systems that enhance usability and streamline processes.

I am particularly drawn to Stripe's commitment to innovation and quality.

Thank you for your time.`;

const meta = {
  title: 'App/LetterPreview',
  component: LetterPreview,
  args: {
    letter: '',
    loading: false,
    error: null,
  },
  argTypes: {
    loading: { control: 'boolean' },
  },
  render: (args) => (
    <div style={{ width: 480, minHeight: 460 }}>
      <LetterPreview {...args} />
    </div>
  ),
} satisfies Meta<typeof LetterPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};
export const Loading: Story = { args: { loading: true, letter: 'Dear Stripe Team,' } };
export const Filled: Story = { args: { letter: SAMPLE_LETTER } };
export const Error: Story = {
  args: { error: 'Generate failed (502): bad gateway' },
};
