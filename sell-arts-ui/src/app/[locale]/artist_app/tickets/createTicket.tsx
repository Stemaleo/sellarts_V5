"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import dynamic from 'next/dynamic';
import * as yup from 'yup';
import { Formik, Form, Field, ErrorMessage as FormikErrorMessage } from 'formik';
import { useRouter } from 'next/navigation';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { createTicket } from '@/actions/tickets';
import { TicketType } from '@/lib/type';
import { Textarea } from '@/components/ui/textarea';

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const validationSchema = yup.object({
    title: yup.string().trim().required('Title is required'),
    description: yup.string().trim().required('Description is required'),
});

function CreateTicket() {
    const router = useRouter();
    

    const initialValues: TicketType = {
        title: '',
        description: '',
    };

    const handleSubmit = async (values: TicketType, { setSubmitting, resetForm }: any) => {
        console.log("Bouton cliqué !");
        try {
            console.log("Submitting ticket:", values);
            const res = await createTicket(values);
            setSubmitting(false);

            if (res?.success) {
                toast.success("Ticket Added");
                resetForm();
                router.refresh();
            } else {
                console.error("API Error:", res);
                toast.error(res.message || "Failed to create Ticket");
            }
        } catch (error) {
            console.error("Request Error:", error);
            toast.error("An error occurred while creating the ticket.");
        }
    };

    return (
        <Card className="md:col-span-2 lg:col-span-1 col-span-3 pt-4 flex flex-col h-full overflow-y-auto">
            <CardHeader>
                <CardTitle className='flex text-xl font-bold justify-between items-center'>
                    Create Tickets
                </CardTitle>
            </CardHeader>
            <CardContent className="flex">
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values, setFieldValue, isSubmitting }) => (
                        <Form className="flex-col gap-4 flex w-full">
                            <div className="flex flex-col space-y-2">
                                <Label htmlFor="title">Ticket Title</Label>
                                <Field
                                    as={Input}
                                    className="w-full"
                                    id="title"
                                    name="title"
                                    placeholder="Enter Ticket title"
                                />
                                <FormikErrorMessage name="title" component="p" className="text-red-500 text-sm" />
                            </div>

                            <div className="flex-1 flex-col flex w-full space-y-2">
                                <Label htmlFor="description">Ticket Content</Label>
                                <Textarea
                                    className='h-[150px]'
                                    value={values.description!}
                                    onChange={(e) => setFieldValue('description', e.target.value)}
                                    placeholder="Enter Ticket Description"
                                />
                                <FormikErrorMessage name="description" component="p" className="text-red-500 text-sm" />
                            </div>

                            <div className="flex items-center justify-between gap-4">
                                <Button type="submit" className="w-full" disabled={isSubmitting}>
                                    {isSubmitting ? 'Creating...' : 'Add New Ticket'}
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </CardContent>
        </Card>
    );
}

export default CreateTicket;