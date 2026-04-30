import type { Meta, StoryObj } from '@storybook/react-vite';
import { Grid } from './Grid';
import { Card } from '@/shared/components/Card';

const meta = {
  title: 'Layout/Grid',
  component: Grid,
  args: {
    columns: 2,
    collapse: 'tabletDown',
    gap: 4,
    // `render` injects the actual children below; this placeholder
    // just satisfies Grid's required-children type for the meta args.
    children: null,
  },
  argTypes: {
    columns: { control: { type: 'number', min: 1, max: 6 } },
    collapse: {
      control: 'select',
      options: ['mobile', 'tabletDown', 'laptopDown', false],
    },
    gap: { control: { type: 'number', min: 1, max: 11 } },
    as: { control: 'select', options: ['div', 'ul', 'ol', 'section'] },
  },
  render: (args) => (
    <div style={{ width: 720 }}>
      <Grid {...args}>
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>Item {i + 1}</Card>
        ))}
      </Grid>
    </div>
  ),
} satisfies Meta<typeof Grid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TwoColumn: Story = {};
export const ThreeColumn: Story = { args: { columns: 3 } };
export const Gallery: Story = { args: { columns: 4, collapse: 'mobile' } };
export const Static: Story = {
  args: { columns: 3, collapse: false },
  parameters: { docs: { description: { story: 'Never collapses; same column count at every viewport.' } } },
};
