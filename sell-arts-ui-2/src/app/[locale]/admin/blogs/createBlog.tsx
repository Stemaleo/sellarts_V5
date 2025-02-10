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
import { createBlog } from '@/actions/blog';
 
import { BlogType } from '@/lib/type';
import BlogPreview from './blogPreview';

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });


const validationSchema = yup.object({
    title: yup.string().trim().required('Title is required'),
    content: yup.string().trim().required('Content is required'),
    duration: yup.number().min(1, 'Duration must be greater than 0').required('Duration is required'),
    author: yup.string().trim().required('Author is required'),


});

function CreateBlog() {
    const router = useRouter();

    const initialValues: BlogType = {
        title: '',
        content: '',
        duration: 0,
        author: '',


    };

    const handleSubmit = async (values: BlogType, { setSubmitting, resetForm }: any) => {
        const res = await createBlog(values);
        setSubmitting(false);

        if (res?.success) {
            toast.success("Blog Added");
            resetForm();
            router.refresh();
        } else {
            toast.error("Failed to create blog");
        }
    };

    const handleReset = (resetForm: any) => {
        resetForm();
    };

    return (
        <Card className="md:col-span-2 lg:col-span-2 col-span-3 pt-4 flex flex-col h-full overflow-y-auto">
            {/* <CardHeader>
        <CardTitle className='flex justify-between items-center'>
          
           
        </CardTitle>
      </CardHeader> */}
            <CardContent className="flex">
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >

                    {({ values, setFieldValue, isSubmitting }) => (
                        <Form className="flex-col gap-4 flex w-full">

                            <div className='flex justify-between items-center'>
                                <Label>Add new blog post</Label>
                                <BlogPreview title={"Preview"} blog={values} />
                            </div>
                            <div className="flex flex-col space-y-2">
                                <Label htmlFor="title">Blog Title</Label>
                                <Field
                                    as={Input}
                                    className="w-full"
                                    id="title"
                                    name="title"
                                    placeholder="Enter Blog title"
                                />
                                <FormikErrorMessage name="title" component="p" className="text-red-500 text-sm" />
                            </div>
                            <div className="flex flex-col space-y-2">
                                <div className='flex items-center justify-center gap-4 w-full'>




                                    <div className="flex w-1/2 flex-col space-y-2">
                                        <Label htmlFor="author">Author</Label>
                                        <Field
                                            as={Input}
                                            type="text"
                                            className="w-full"
                                            id="author"
                                            name="author"
                                            placeholder="Enter Author Name"
                                            required />

                                    </div>
                                    <div className="flex w-1/2 flex-col space-y-2">
                                        <Label htmlFor="duration">Blog Duration</Label>
                                        <Field
                                            as={Input}
                                            type="number"
                                            className="w-full"
                                            id="duration"
                                            name="duration"
                                            placeholder="Enter Blog Duration"

                                            required
                                        />

                                    </div>

                                </div>
                                <div className='flex items-center justify-between gap-4 w-full'>
                                    <FormikErrorMessage name="author" component="p" className="text-red-500 text-sm w-1/2" />
                                    <FormikErrorMessage name="duration" component="p" className="text-red-500 text-sm w-1/2" />
                                </div>
                            </div>

                            <div className="flex-1 flex-col flex w-full space-y-2">
                                <Label htmlFor="content">Blog Content</Label>
                                <JoditEditor
                                    value={values.content}
                                    onBlur={(content) => setFieldValue('content', content)}
                                    config={{ height: 300 }}
                                />
                                <FormikErrorMessage name="content" component="p" className="text-red-500 text-sm" />
                            </div>


                            <div className="flex items-center justify-between gap-4">
                                <Button type="submit" className="w-full" disabled={isSubmitting}>
                                    {isSubmitting ? 'Creating...' : 'Add New Blog'}
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </CardContent>
        </Card>
    );
}

export default CreateBlog;
