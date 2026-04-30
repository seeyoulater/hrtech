import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { ApplicationCard } from './ApplicationCard';
import type { Application } from '@/shared/types/application';

const sampleApplication: Application = {
  id: 'sample-1',
  jobTitle: 'Senior Engineer',
  company: 'Stripe',
  strengths: 'Design systems and reliable shipping',
  details: '5 years on developer tooling',
  letter: `Dear Stripe Team,

I am excited to apply for the Senior Engineer position. With five years of experience in developer tooling, I have honed my skills in creating robust design systems that enhance usability and streamline processes.

Throughout my career, I have consistently delivered reliable shipping solutions that meet the needs of both developers and end-users.`,
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

const meta = {
  title: 'App/ApplicationCard',
  component: ApplicationCard,
  args: {
    application: sampleApplication,
    onDelete: fn(),
  },
  render: (args) => (
    <div style={{ width: 360 }}>
      <ApplicationCard {...args} />
    </div>
  ),
} satisfies Meta<typeof ApplicationCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ShortLetter: Story = {
  args: {
    application: {
      ...sampleApplication,
      letter: 'Dear Stripe Team,\n\nI’m interested in the role.',
    },
  },
};
