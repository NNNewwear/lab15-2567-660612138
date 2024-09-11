"use client";

import TermsAndCondsModal from "@components/TermsAndCondsModal";
import Footer from "@components/Footer";

import { useDisclosure } from "@mantine/hooks";
import { runningPlans } from "@lib/runningPlans";
import {
  Anchor,
  Button,
  Checkbox,
  Container,
  Group,
  PasswordInput,
  Divider,
  Radio,
  Select,
  Space,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";

import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";

const schema = z
  .object({
    firstName: z
      .string()
      .min(3, { message: "First name must have at least 3 characters" }),
    lastName: z
      .string()
      .min(3, { message: "Last name must have at least 3 characters" }),
    email: z.string().email({ message: "Invalid email format" }),
    plan: z.enum(["funrun", "mini", "half", "full"], {
      errorMap: () => ({ message: "Please select a plan" }),
    }),
    gender: z.enum(["male", "female"], {
      errorMap: () => ({ message: "Please choose a gender" }),
    }),
    acceptTermsAndConds: z.literal(true, {
      // message: "You must accept terms and conditions",
      errorMap: () => ({
        message: "You must accept terms and conditions",
      }),
    }),
    hasCoupon: z.boolean(),
    coupon: z.string(),
    password: z.string()
    .min(6, { message: "Password must contain at least 6 characters"})
    .max(12, {message: "Password must not exceed 12 characters"}),
    confirmPassword: z.string(),
  })
  .refine(
    //refine allows you check error in your own way
    //in this example, we check "hasCoupon" with "coupon" fields
    (data) => {
      // if user does not tick "I have coupon", then it's ok
      if (!data.hasCoupon) return true;

      // if user tick "I have coupon" and fill correct code, then it's ok too
      if (data.hasCoupon && data.coupon === "CMU2023") return true;

      // ticking "I have coupon" but fill wrong coupon code, show error
      return false;
    },
    //set error message and the place it should show
    {
      message: "Invalid coupon code",
      path: ["coupon"],
    }
  )
  .refine(

    (pass) => {

      if(pass.confirmPassword === pass.password) return true;

      return false;
    },
    {
      message: "Password does not match",
      path: ["confirmPassword"],
    }
  );


export default function Home() {
  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      plan: null,
      gender: null,
      acceptTermsAndConds: false,
      hasCoupon: false,
      coupon: "",
      password: "",
      confirmPassword: "",
    },
    validate: zodResolver(schema),
  });

  const computePrice = () => {
    let price = 0;

    //TIP : get value of currently filled form with variable "form.values"

    if (form.values.plan === "funrun") price = 500;
    if (form.values.plan === "mini") price = 800;
    if (form.values.plan === "half") price = 1200;
    if (form.values.plan === "full") price = 1500;
    //check the rest plans by yourself
    //TIP : check /src/app/libs/runningPlans.js
    if(form.values.coupon === "CMU2023") price = price*0.7;
    //check discount here

    return price; 
  };

  return (
    <div>
      <Container size="500px">
        <Space h="lg" />
        <Title fs="italic" ta="center" c="pink">
          Register CMU Marathon 🥈
        </Title>
        <Space h="lg" />

        {/* add form */}
        <form onSubmit={form.onSubmit(() => alert("See you at CMU Marathon"))}>
          <Stack gap="sm">
            <Group grow align="start">
              <TextInput
                label="First Name"
                {...form.getInputProps("firstName")}
              />
              <TextInput
                label="Last Name"
                {...form.getInputProps("lastName")}
              />
            </Group>
            <TextInput label="Email" {...form.getInputProps("email")} />

            <PasswordInput
              label="Password"
              description="Password must contain 6 - 12 characters"
              {...form.getInputProps("password")}
            />
            <PasswordInput
              label="Confirm Password"
              {...form.getInputProps("confirmPassword")}
            />

            <Select
              label="Plan"
              data={runningPlans}
              placeholder="Please select plan..."
              {...form.getInputProps("plan")}
            />
            <Space />
            <Radio.Group label="Gender" {...form.getInputProps("gender")}>
              <Radio value="male" label="Male 👨" mb="xs" />
              <Radio value="female" label="Female 👧" />
            </Radio.Group>
            <Space />

            {/* Coupon section */}
            <Stack gap="5px">
              <Text size="sm" fw="bold">
                Coupon (30% discount)
              </Text>
              <Checkbox
                label="I have coupon"
                {...form.getInputProps("hasCoupon")}
              />
              {form.values.hasCoupon && (
                <TextInput label="Coupon" {...form.getInputProps("coupon")} />
              )}
            </Stack>

            <Text fw="bold">
              {" "}
              Total Price : {computePrice().toLocaleString()} BATH
            </Text>

            <Divider variant="dashed" />

            <Checkbox
              {...form.getInputProps("acceptTermsAndConds")}
              label={
                <Text>
                  I accept{" "}
                  <Anchor onClick={open} href="#">
                    terms and conditions
                  </Anchor>
                </Text>
              }
            />
            <Button type="submit">Register</Button>
          </Stack>
        </form>

        <Footer year={2024} fullName="Kantapong Temeesak" studentId="660612138" />
      </Container>

      <TermsAndCondsModal opened={opened} close={close} />
    </div>
  );
}
