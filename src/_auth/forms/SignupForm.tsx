import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { SignupValidation } from "@/lib/validation";
import Loader from "@/components/shared/Loader";
import {
  useCreateUserAccount,
  useSignInAccount,
} from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/authContext";

const SignupForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();

  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });

  const { mutateAsync: createUserAccount, isPending: isCreatingAccount } = useCreateUserAccount();
  const { mutateAsync: signInAccount, isPending: isSigningInUser } = useSignInAccount();

  const handleSignup = async (user: z.infer<typeof SignupValidation>) => {
    try {
      const newUser = await createUserAccount(user);

      if (!newUser) {
        return toast({ title: "Sign up failed. Please try again." });
      }

      const session = await signInAccount({
        email: user.email,
        password: user.password,
      });

      if (!session) {
        toast({ title: "Something went wrong. Please login your new account" });
        return navigate("/sign-in");
      }

      const isLoggedIn = await checkAuthUser();

      if (isLoggedIn) {
        form.reset();
        navigate("/");
      } else {
        toast({ title: "Login failed. Please try again." });
      }
    } catch (error) {
      console.log({ error });
    }
  };

  const isLoading = isCreatingAccount || isSigningInUser || isUserLoading;

  return (
    <div className="sm:w-420 flex-center flex-col p-8 sm:p-12 bg-black border border-zinc-800 rounded-2xl shadow-2xl">
      <Form {...form}>
        <div className="flex flex-col items-center w-full">
          {/* Logo */}
          <img src="/assets/images/logo.svg" alt="logo" className="w-32 mb-6" />

          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="h3-bold md:h2-bold pt-5 sm:pt-0">Create an account</h2>
            <p className="text-light-3 small-medium md:base-regular mt-2">
              Join the community. Please enter your details.
            </p>
          </div>

          <form
            onSubmit={form.handleSubmit(handleSignup)}
            className="flex flex-col gap-4 w-full"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-400">Name</FormLabel>
                  <FormControl>
                    <Input 
                      type="text" 
                      className="shad-input bg-zinc-900 border-zinc-800 focus-visible:ring-1 focus-visible:ring-primary-500" 
                      disabled={isLoading}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-red" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-400">Username</FormLabel>
                  <FormControl>
                    <Input 
                      type="text" 
                      className="shad-input bg-zinc-900 border-zinc-800 focus-visible:ring-1 focus-visible:ring-primary-500" 
                      disabled={isLoading}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-red" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-400">Email</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      className="shad-input bg-zinc-900 border-zinc-800 focus-visible:ring-1 focus-visible:ring-primary-500" 
                      disabled={isLoading}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-red" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-zinc-400">Password</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      className="shad-input bg-zinc-900 border-zinc-800 focus-visible:ring-1 focus-visible:ring-primary-500" 
                      disabled={isLoading}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-red" />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="shad-button_primary w-full h-11 mt-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex-center gap-2">
                  <Loader /> Creating account...
                </div>
              ) : (
                "Sign Up"
              )}
            </Button>

            <p className="text-small-regular text-light-2 text-center mt-4">
              Already have an account?
              <Link
                to="/sign-in"
                className="text-primary-500 text-small-semibold ml-1 hover:underline"
              >
                Log in
              </Link>
            </p>
          </form>
        </div>
      </Form>
    </div>
  );
};

export default SignupForm;