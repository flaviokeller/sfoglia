import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ContactForm from './ContactForm.vue';

const meta: Meta<typeof ContactForm> = {
  title: 'Components/Contact form',
  component: ContactForm,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Submits to Netlify Forms via fetch. In Storybook the POST to `/` fails, which is the intended way to exercise the error state. Validation runs entirely client-side and is fully testable here.',
      },
    },
  },
  args: { formName: 'contact', labels: {} },
  render: (args) => ({
    components: { ContactForm },
    setup: () => ({ args }),
    template: '<ContactForm v-bind="args" />',
  }),
};
export default meta;
type Story = StoryObj<typeof ContactForm>;

export const German: Story = {};

export const English: Story = {
  args: {
    labels: {
      name: 'Name',
      email: 'Email',
      message: 'Message',
      submit: 'Send message',
      sending: 'Sending …',
      success: 'Thanks! Your message came through.',
      error: 'That did not work. Please try again later.',
      required: 'This field is required.',
      invalidEmail: 'Please enter a valid email address.',
    },
  },
};
